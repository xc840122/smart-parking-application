//
//  BookingView.swift
//  SmartPark
//
//  Created by 阿福 on 12/03/2025.
//

import SwiftUI
import Clerk

struct BookingView: View {
    let parkingSpot: ParkingSpot
    @State private var startTime = Date().addingTimeInterval(3600) // Default to now
    @State private var endTime = Date().addingTimeInterval(7200) // Default +1 hour
    @State private var estimatedPrice: Double = 0
    @State private var showConfirmationAlert = false
    @State private var isBookingConfirmed = false
    @State private var showErrorAlert = false
    @State private var errorMessage = ""
    @State private var calculation: Calculation?
    private let bookingService = BookingService()

    var body: some View {
        VStack(spacing: 24) {
            // Time Selection Area
            VStack(spacing: 16) {
                TimePickerView(title: "Start Time", selection: $startTime, range: Date()...)
                TimePickerView(title: "End Time", selection: $endTime, range: startTime.addingTimeInterval(3600)...)
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
                showConfirmationAlert = true
            }) {
                Text("Confirm Booking")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.black)
                    .foregroundColor(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .padding(.bottom, 20)
        }
        .padding()
        .navigationTitle("Booking")
        .navigationBarTitleDisplayMode(.inline)
        .onChange(of: startTime) { adjustEndTime(); calculatePrice() }
        .onChange(of: endTime) { calculatePrice() }
        .alert("Confirm Booking", isPresented: $showConfirmationAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Confirm") { confirmBooking() }
        } message: {
            Text("Are you sure you want to book from \(formattedTime(startTime)) to \(formattedTime(endTime))?")
        }
        .alert("Booking Confirmed", isPresented: $isBookingConfirmed) {
            Button("OK", role: .cancel) {}
        }
        .alert("Booking Failed", isPresented: $showErrorAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(errorMessage)
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
        Task {
            do {
                let userId = Clerk.shared.user?.id ?? ""
                let calculation = try await bookingService.priceCalculation(userId: userId, parkingSpotId: parkingSpot.id, startTime: startTime, endTime: endTime)
                let price = (1 - calculation.discountRate) * calculation.totalCost
                self.calculation = calculation
                
                DispatchQueue.main.async {
                    estimatedPrice = price
                }
            } catch {
                DispatchQueue.main.async {
                    errorMessage = "Error: \(error.localizedDescription)"
                    showErrorAlert = true
                }
            }
        }
    }

    /// Booking confirmation logic
    private func confirmBooking() {
        Task {
            do {
                let bookid = calculation?.parkingName ?? ""
                let userId = Clerk.shared.user?.id ?? ""
                let success = try await bookingService.confirmBooking(bookingId: bookid, userId: userId)

                DispatchQueue.main.async {
                    if success {
                        isBookingConfirmed = true 
                    } else {
                        errorMessage = "Booking failed. Please try again."
                        showErrorAlert = true
                    }
                }
            } catch {
                DispatchQueue.main.async {
                    errorMessage = "Error: \(error.localizedDescription)"
                    showErrorAlert = true
                }
            }
        }
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
