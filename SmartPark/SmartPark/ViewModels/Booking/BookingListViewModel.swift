//
//  BookingListViewModel.swift
//  SmartPark
//
//  Created by 阿福 on 16/03/2025.
//

import SwiftUI
import Clerk

@Observable
class BookingListViewModel {
    var bookings: [Booking] = []
    var isLoading = false
    var errorMessage: String?

    private let bookingService = BookingService()

    func fetchBookings() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let userId = await Clerk.shared.user?.id ?? ""
            guard !userId.isEmpty else {
                errorMessage = "User ID is missing."
                isLoading = false
                return
            }

            bookings = try await bookingService.getBookings(userId: userId)
            isLoading = false
        } catch {
            errorMessage = "Failed to load bookings."
            isLoading = false
            print("❌ fetchBookings() error:", error.localizedDescription)
        }
    }
    
    
}
