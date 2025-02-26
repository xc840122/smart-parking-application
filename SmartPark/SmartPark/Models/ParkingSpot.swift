//
//  ParkingSpot.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation

struct ParkingFactors: Codable {
    let occupancyRate: Int
    let peakHours: Bool
    let weatherCondition: String
}

struct ParkingSpot: Identifiable, Codable {
    let id: Int
    let name: String
    let position: String
    let spaces: Int
    let baseRate: Double
    let adjustedRate: Double
    let availableTime: String
    let rating: Double
    let factors: ParkingFactors
}
