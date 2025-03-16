//
//  Booking.swift
//  SmartPark
//
//  Created by 阿福 on 16/03/2025.
//

import Foundation

struct Booking: Codable, Identifiable, Hashable {
    let id: String
    let discountRate: Double
    let endTime: Int64
    let parkingName: String
    let parkingSpaceId: String
    let startTime: Int64
    let state: String
    let totalCost: Double
    let updatedAt: Int64
    let userId: String
    let creationTime: Double?

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case creationTime = "_creationTime"
        case discountRate, endTime, parkingName, parkingSpaceId, startTime, state, totalCost, updatedAt, userId
    }
    
    var startDate: Date {
        Date(timeIntervalSince1970: TimeInterval(startTime) / 1000)
    }

    var endDate: Date {
        Date(timeIntervalSince1970: TimeInterval(endTime) / 1000)
    }

    var formattedStartTime: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm"
        return formatter.string(from: startDate)
    }

    var formattedEndTime: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm"
        return formatter.string(from: endDate)
    }
}
