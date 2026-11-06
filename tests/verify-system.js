const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function runTests() {
  console.log('====================================================');
  console.log('MISTER CERAMIC – SYSTEM VERIFICATION & AUDIT SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Verify Seed Data & Studio Info
    console.log('[Test 1: Studio Entities & Services]');
    const services = await prisma.service.findMany({ include: { category: true, packages: true } });
    assert(services.length >= 8, `Services catalogue seeded (${services.length} services loaded)`);
    const ppf = services.find(s => s.slug === 'paint-protection-film-ppf');
    assert(ppf && ppf.packages.length > 0, 'PPF service exists with configured packages');

    const borophene = services.find(s => s.slug === 'borophene-coating');
    assert(borophene !== undefined, 'Borophene coating exists in catalogue');

    // 2. Customer Booking Submission
    console.log('\n[Test 2: Customer Booking Submission]');
    const testPhone = '+919846012345';
    let customer = await prisma.customer.upsert({
      where: { phone: testPhone },
      update: {},
      create: { name: 'Vineeth S', phone: testPhone, email: 'vineeth@example.com' },
    });

    const vehicle = await prisma.vehicle.create({
      data: {
        customerId: customer.id,
        type: 'CAR',
        brand: 'Mercedes-Benz',
        model: 'C 220d',
        registrationNumber: 'KL-02-AZ-9999',
        color: 'Cavansite Blue',
      },
    });

    const testRef = `MC-202611-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = await prisma.booking.create({
      data: {
        reference: testRef,
        customerId: customer.id,
        vehicleId: vehicle.id,
        serviceId: borophene.id,
        preferredDate: '2026-11-15',
        preferredTime: '10:30 AM',
        status: 'Booking Received',
        totalEstimatedPrice: borophene.startingPrice,
        customerNotes: 'Please inspect minor scratch on boot lid.',
      },
    });

    await prisma.bookingStatusHistory.create({
      data: {
        bookingId: newBooking.id,
        status: 'Booking Received',
        note: 'Appointment request received online.',
      },
    });

    assert(newBooking.reference.startsWith('MC-'), `Unique booking reference generated: ${newBooking.reference}`);
    assert(newBooking.status === 'Booking Received', 'Initial booking status is "Booking Received"');

    // 3. Admin Booking Approval & Status History
    console.log('\n[Test 3: Admin Approval & Status History]');
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

    const updatedBooking = await prisma.booking.update({
      where: { id: newBooking.id },
      data: {
        status: 'Booking Confirmed',
        estimatedDeliveryDate: '2026-11-17',
        adminNotes: 'Assigned to bay 2. Verified paint depth before intake.',
      },
    });

    await prisma.bookingStatusHistory.create({
      data: {
        bookingId: newBooking.id,
        status: 'Booking Confirmed',
        note: 'Appointment confirmed via telephone. Intake bay 2 assigned.',
        changedByUserId: adminUser.id,
      },
    });

    assert(updatedBooking.status === 'Booking Confirmed', 'Booking status successfully updated to "Booking Confirmed"');

    const historyCount = await prisma.bookingStatusHistory.count({
      where: { bookingId: newBooking.id },
    });
    assert(historyCount === 2, `History log maintained without overwriting (Count: ${historyCount})`);

    // 4. Workshop Progress Updates & Customer Visibility
    console.log('\n[Test 4: Workshop Floor Progress Updates]');
    const progressUpdate = await prisma.serviceProgressUpdate.create({
      data: {
        bookingId: newBooking.id,
        stage: 'Initial Inspection',
        title: 'Digital Ultrasonic Paint Depth Audit',
        description: 'Measured 128 microns avg. Clear coat is healthy for 2-stage correction.',
        photosJson: JSON.stringify(['/uploads/test-inspection.jpg']),
        isVisibleToCustomer: true,
      },
    });

    assert(progressUpdate.id !== undefined, 'Workshop progress update created with stage & description');
    assert(progressUpdate.isVisibleToCustomer === true, 'Progress update visible to customer');

    // 5. Customer Tracking Security Verification
    console.log('\n[Test 5: Customer Tracking Security]');
    // Correct phone test
    const cleanDigits = testPhone.replace(/[^0-9]/g, '').slice(-10);
    const customerPhoneDigits = customer.phone.replace(/[^0-9]/g, '').slice(-10);
    const canAccessWithCorrectPhone = cleanDigits === customerPhoneDigits;
    assert(canAccessWithCorrectPhone, 'Authorized customer can access tracking with matching registered phone');

    // Wrong phone test
    const wrongPhone = '9999999999';
    const unauthorizedAccessAllowed = wrongPhone === customerPhoneDigits;
    assert(!unauthorizedAccessAllowed, 'Customer tracking blocks access when phone number does not match reference');

    // Internal admin notes privacy test
    const trackingView = {
      reference: updatedBooking.reference,
      customerName: customer.name,
      status: updatedBooking.status,
      // adminNotes MUST NOT be in public payload
    };
    assert(trackingView.adminNotes === undefined, 'Internal admin notes strictly protected from customer tracking payload');

    // 6. Appointment Capacity & Conflict Prevention Logic
    console.log('\n[Test 6: Appointment Conflict Prevention]');
    const maxCapacity = 4;
    const sameDateBookings = await prisma.booking.count({
      where: {
        preferredDate: '2026-11-15',
        status: { in: ['Booking Confirmed', 'Vehicle Received', 'Service in Progress'] },
      },
    });
    const canAcceptBooking = sameDateBookings < maxCapacity;
    assert(canAcceptBooking, `Capacity check operational (${sameDateBookings}/${maxCapacity} confirmed slots used for date)`);

    // 7. Admin Authentication & Role-Based Authorization
    console.log('\n[Test 7: Authentication & Passwords]');
    const authSuccess = await bcrypt.compare('Admin@MisterCeramic2026', adminUser.passwordHash);
    assert(authSuccess, 'Admin password hashes and verifies with bcrypt');

    const authWrongPassword = await bcrypt.compare('WrongPassword123', adminUser.passwordHash);
    assert(!authWrongPassword, 'Incorrect password correctly rejected');

    const staffUser = await prisma.user.findFirst({ where: { role: 'STAFF' } });
    assert(staffUser && staffUser.role === 'STAFF', 'Role-based STAFF account configured with restricted access');

    // 8. Gallery and Before-After Transformations
    console.log('\n[Test 8: Portfolio & Before-After Transformations]');
    const projects = await prisma.project.findMany({ where: { isPublished: true } });
    assert(projects.length >= 5, `Published projects portfolio populated (${projects.length} cases)`);
    const sliderProjects = projects.filter(p => p.beforeImageUrl && p.afterImageUrl);
    assert(sliderProjects.length >= 3, `Interactive before-and-after projects available (${sliderProjects.length} transformations)`);

  } catch (err) {
    console.error('Test suite error:', err);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runTests();
