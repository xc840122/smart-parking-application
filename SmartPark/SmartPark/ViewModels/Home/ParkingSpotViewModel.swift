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
    // load local json data
    private let localService = LocalParkingSpotService()
    
    func loadParkingLots() async {
        do {
            parkingLots = try await localService.fetchParkingLots()
            print("load local data: \(parkingLots.count)")
        } catch {
            dump(error.localizedDescription)
        }
    }
}
