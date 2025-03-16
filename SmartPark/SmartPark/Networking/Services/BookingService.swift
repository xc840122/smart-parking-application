//
//  BookingService.swift
//  SmartPark
//
//  Created by 阿福 on 12/03/2025.
//

import Foundation
import Moya

/// Service to handle Booking API requests
class BookingService {
    private let provider = MoyaProvider<BookingAPI>(plugins: [AuthPlugin()])
    
    /// Price Calculation
    func priceCalculation(userId: String, parkingSpotId: String, startTime: Date, endTime: Date) async throws -> Calculation {
        let startTimeStamp = Int64(startTime.timeIntervalSince1970 * 1000) // Convert to milliseconds
        let endTimeStamp = Int64(endTime.timeIntervalSince1970 * 1000)
        
        let response = try await provider.requestAsync(.priceCalculation(clerkUserId: userId, parkingSpotId: parkingSpotId, startTime: startTimeStamp, endTime: endTimeStamp))
                
        // Check if the API returned success
        return try response.decode()
    }
    
    /// Reserve
    func reserve(userId: String, parkingSpotId: String, startTime: Date, endTime: Date) async throws -> Reservation {
        let startTimeStamp = Int64(startTime.timeIntervalSince1970 * 1000) // Convert to milliseconds
        let endTimeStamp = Int64(endTime.timeIntervalSince1970 * 1000)
        
        let response = try await provider.requestAsync(.reserve(clerkUserId: userId, parkingSpotId: parkingSpotId, startTime: startTimeStamp, endTime: endTimeStamp))
                
        // Check if the API returned success
        return try response.decode()
    }
    
    func confirmBooking(bookingId: String, userId: String) async throws -> Bool {
        let response = try await provider.requestAsync(.createBooking(bookingId: bookingId, clerkUserId: userId))
        return response.isSuccess()
    }
}
