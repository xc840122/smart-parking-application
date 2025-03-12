//
//  ParkingSpot.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation

struct PLocation: Codable, Hashable {
    let lat: Double
    let lng: Double
}

struct ParkingSpot: Identifiable, Codable, Hashable {
    static func == (lhs: ParkingSpot, rhs: ParkingSpot) -> Bool {
        return lhs.id == rhs.id
    }
    
    let id: String
    let creationTime: Double
    let name: String
    let area: String
    let city: String
    let street: String
    let unit: String
    let availableSlots: Int
    let totalSlots: Int
    let pricePerHour: Double
    let location: PLocation
    let isActive: Bool
    
    private enum CodingKeys: String, CodingKey {
        case id = "_id"
        case creationTime = "_creationTime"
        case name, area, city, street, unit, availableSlots, totalSlots, pricePerHour, location, isActive
    }
}
