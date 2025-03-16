//
//  Reservation.swift
//  SmartPark
//
//  Created by 阿福 on 15/03/2025.
//

import Foundation

struct Reservation: Codable, Hashable {
    let bookingId: String
    let dicountRate: Double
    let totalCost: Double
}
