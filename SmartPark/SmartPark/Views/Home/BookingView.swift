//
//  BookingView.swift
//  SmartPark
//
//  Created by 阿福 on 12/03/2025.
//

import SwiftUI

struct BookingView: View {
    let parkingSpot: ParkingSpot
    @State private var startTime = Date() // Default to now
    @State private var endTime = Date().addingTimeInterval(3600) // Default +1 hour
    @State private var estimatedPrice: Double = 0
    @State private var showConfirmationAlert = false
    @State private var isBookingConfirmed = false

    var body: some View {
        VStack(spacing: 24) {
            // Page Title
            Text("Book Parking")
                .font(.system(size: 22, weight: .bold))
                .frame(maxWidth: .infinity, alignment: .leading)

            // Time Selection Area
            VStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Start Time")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.black)
                    DatePicker("Select Start Time", selection: $startTime, in: Date()..., displayedComponents: .hourAndMinute)
                        .labelsHidden()
                        .datePickerStyle(.wheel)
                        .frame(height: 100)
                        .onChange(of: startTime) { adjustEndTime() }
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text("End Time")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.black)
                    DatePicker("Select End Time", selection: $endTime, in: startTime.addingTimeInterval(3600)..., displayedComponents: .hourAndMinute)
                        .labelsHidden()
                        .datePickerStyle(.wheel)
                        .frame(height: 100)
                }
            }
            .padding(.vertical, 10)

            // Duration & Estimated Price
            VStack(spacing: 12) {
                HStack {
                    Text("Duration")
                        .font(.system(size: 16, weight: .medium))
                    Spacer()
                    Text("\(calculateDuration()) hours")
                        .font(.system(size: 16, weight: .bold))
                }

                HStack {
                    Text("Estimated Price")
                        .font(.system(size: 16, weight: .medium))
                    Spacer()
                    Text("$\(estimatedPrice, specifier: "%.2f")")
                        .font(.system(size: 16, weight: .bold))
                }
            }
            .padding()
            .background(RoundedRectangle(cornerRadius: 8).stroke(Color.black, lineWidth: 1))

            Spacer()

            // Confirm Booking Button
            Button(action: {
                showConfirmationAlert = true // Show confirmation alert
            }) {
                Text("Confirm Booking")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.black)
                    .foregroundColor(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
        }
        .padding()
        .navigationTitle("Booking")
        .onChange(of: startTime) { adjustEndTime(); calculatePrice() }
        .onChange(of: endTime) { calculatePrice() }
        .alert("Confirm Booking", isPresented: $showConfirmationAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Confirm") { confirmBooking() } // User must confirm
        } message: {
            Text("Are you sure you want to book from \(formattedTime(startTime)) to \(formattedTime(endTime))?")
        }
        .alert("Booking Confirmed", isPresented: $isBookingConfirmed) {
            Button("OK", role: .cancel) {}
        }
        .onAppear { calculatePrice() }
    }

    /// Adjust `endTime` to ensure it is at least 1 hour after `startTime`
    private func adjustEndTime() {
        if endTime <= startTime {
            endTime = startTime.addingTimeInterval(3600) // At least 1 hour later
        }
    }

    /// Format Date for display
    private func formattedTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mm a"
        return formatter.string(from: date)
    }

    /// Calculate parking duration in hours
    private func calculateDuration() -> Int {
        return max(1, Int(endTime.timeIntervalSince(startTime) / 3600)) // At least 1 hour
    }

    /// Calculate estimated price
    private func calculatePrice() {
        estimatedPrice = Double(calculateDuration()) * parkingSpot.pricePerHour
    }

    /// Booking confirmation logic
    private func confirmBooking() {
        print("Booking confirmed from \(startTime) to \(endTime) for \(estimatedPrice)")
        isBookingConfirmed = true
    }
}

#Preview {
    BookingView(parkingSpot: ParkingSpot(
        id: "test",
        creationTime: 0,
        name: "Test Parking",
        area: "Test Area",
        city: "Test City",
        street: "Test Street",
        unit: "Test Unit",
        availableSlots: 5,
        totalSlots: 10,
        pricePerHour: 2.5,
        location: PLocation(lat: 34.0, lng: -117.0),
        isActive: true
    ))
}
