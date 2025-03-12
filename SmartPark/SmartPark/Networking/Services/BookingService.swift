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

    /// Create a new booking
    func createBooking(parkingSpotId: String, startTime: Date, endTime: Date) async throws -> Bool {
        let startTimeStamp = Int64(startTime.timeIntervalSince1970 * 1000) // Convert to milliseconds
        let endTimeStamp = Int64(endTime.timeIntervalSince1970 * 1000)

        let response = try await provider.requestAsync(.createBooking(parkingSpotId: parkingSpotId, startTime: startTimeStamp, endTime: endTimeStamp))

        // Decode the API response
        let decodedResponse = try JSONDecoder().decode(APIResponse<Bool>.self, from: response.data)

        // Check if the API returned success
        return decodedResponse.result
    }
}
