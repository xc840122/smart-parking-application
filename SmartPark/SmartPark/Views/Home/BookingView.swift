//
//  BookingView.swift
//  SmartPark
//
//  Created by 阿福 on 12/03/2025.
//

import SwiftUI
import Clerk

struct BookingView: View {
    @Environment(\.selectedTab) private var selectedTab
    @EnvironmentObject var navigationManager: NavigationManager
    
    let parkingSpot: ParkingSpot
    @State private var startTime = Date().addingTimeInterval(3600) // Default to now
    @State private var endTime = Date().addingTimeInterval(7200) // Default +1 hour
    @State private var showConfirmationAlert = false
    @State private var isBookingConfirmed = false
    @State private var showErrorAlert = false
    @State private var errorMessage = ""
    @State private var calculation: Calculation?
    @State private var isLoading = false
    private let bookingService = BookingService()
    
    private var estimatedPrice: Double {
        if let calculation = calculation {
            return (1 - calculation.discountRate) * calculation.totalCost
        }
        return 0.0
    }

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
                    Text("Original Price")
                        .font(.system(size: 16, weight: .medium))
                    Spacer()
                    if let calculation = calculation {
                        Text("$\(calculation.totalCost, specifier: "%.2f")")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.gray)
                            .strikethrough()
                    } else {
                        Text("Calculating...")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.gray)
                    }
                }
                
                HStack {
                    Text("Discount")
                        .font(.system(size: 16, weight: .medium))
                    Spacer()
                    if let calculation = calculation {
                        Text("\(Int(calculation.discountRate * 100))% Off")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.green)
                    }
                }

                HStack {
                    Text("Final Price")
                        .font(.system(size: 16, weight: .medium))
                    Spacer()
                    if calculation != nil {
                        Text("$\(estimatedPrice, specifier: "%.2f")")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.black)
                    } else {
                        Text("Calculating...")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.gray)
                    }
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
        .overlay(
            isLoading ? AnyView(LoadingView(title: "Booking...").transition(.opacity)) : AnyView(EmptyView())
        )
        .animation(.easeInOut, value: isLoading) // 平滑过渡
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
            Button("View Bookings") {
                navigationManager.resetToRoot(tab: "Home")
                selectedTab.wrappedValue = "Bookings"
            }
            Button("Book Another", role: .cancel) {
                navigationManager.resetToRoot(tab: "Home")
            }
        } message: {
            Text("Your booking has been successfully confirmed. What would you like to do next?")
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
    private func calculateDuration() -> String {
        let startComponents = Calendar.current.dateComponents([.hour, .minute], from: startTime)
        let endComponents = Calendar.current.dateComponents([.hour, .minute], from: endTime)
        
        guard let startHour = startComponents.hour, let startMinute = startComponents.minute,
              let endHour = endComponents.hour, let endMinute = endComponents.minute else {
            return "Invalid Time"
        }
        
        let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute)
        let hours = totalMinutes / 60
        let minutes = totalMinutes % 60
        
        if hours > 0 && minutes > 0 {
            return "\(hours) hours \(minutes) minutes"
        } else if hours > 0 {
            return "\(hours) hours"
        } else {
            return "\(minutes) minutes"
        }
    }

    /// Calculate estimated price
    private func calculatePrice() {
        Task {
            do {
                let userId = Clerk.shared.user?.id ?? ""
                let calculation = try await bookingService.priceCalculation(userId: userId, parkingSpotId: parkingSpot.id, startTime: startTime, endTime: endTime)
                self.calculation = calculation
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
            DispatchQueue.main.async {
                isLoading = true
            }
            
            do {
                let userId = Clerk.shared.user?.id ?? ""
                
                let reservation = try await bookingService.reserve(userId: userId, parkingSpotId: parkingSpot.id, startTime: startTime, endTime: endTime)
                
                guard !reservation.bookingId.isEmpty else {
                    DispatchQueue.main.async {
                        errorMessage = "Reservation failed. No booking ID received."
                        showErrorAlert = true
                        isLoading = false
                    }
                    return
                }
                
                let success = try await bookingService.confirmBooking(bookingId: reservation.bookingId, userId: userId)

                DispatchQueue.main.async {
                    if success {
                        isBookingConfirmed = true
                    } else {
                        errorMessage = "Booking failed. Please try again."
                        showErrorAlert = true
                    }
                    isLoading = false
                }
            } catch {
                DispatchQueue.main.async {
                    errorMessage = "Error: \(error.localizedDescription)"
                    showErrorAlert = true
                    isLoading = false
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
