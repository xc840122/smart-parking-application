//
//  HomeView.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import SwiftUI

struct HomeView: View {
    @State private var viewModel = ParkingSpotViewModel()
    
    var body: some View {
        VStack {
            Text("parking spots count: \(viewModel.parkingLots.count)")
        }
        .task {
            await viewModel.loadParkingLots()
        }
    }
}

#Preview {
    HomeView()
}
