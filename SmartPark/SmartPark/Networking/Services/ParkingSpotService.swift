//
//  ParkingSpotService.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation
import Moya

class ParkingSpotService {
    private let provider = MoyaProvider<ParkingSpotAPI>(plugins: [AuthPlugin()])
    
    func fetchParkingLots() async throws -> [ParkingSpot] {
        let response = try await provider.requestAsync(.getParkingLots)
        return try JSONDecoder().decode([ParkingSpot].self, from: response.data)
    }
}
