//
//  ParkingSpotViewModel.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation
import Observation

@Observable
class ParkingSpotViewModel {
    var parkingLots: [ParkingSpot] = []
    
    private let localService = ParkingSpotService()
    
    func loadParkingLots() async {
        do {
            let response = try await localService.fetchParkingLots()
            parkingLots = response.data
            print("load local data: \(parkingLots.count)")
        } catch {
            dump(error.localizedDescription)
        }
    }
}
