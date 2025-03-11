//
//  ParkingSpot.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation

struct Location: Codable {
    let lat: Double
    let lng: Double
}

struct ParkingSpot: Identifiable, Codable {
    let _id: String
    let _creationTime: Double
    let name: String
    let area: String
    let city: String
    let street: String
    let unit: String
    let availableSlots: Int
    let totalSlots: Int
    let pricePerHour: Int
    let location: Location
    let isActive: Bool
    
    var id: String { _id } // Conforming to Identifiable protocol
}

struct ParkingSpotResponse: Decodable {
    let result: Bool
    let message: String
    let data: [ParkingSpot]
}
