//
//  ParkingSpotRow.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import SwiftUI

struct ParkingSpotRow: View {
    let parkingSpot: ParkingSpot
    
    var body: some View {
        HStack {
            Image(systemName: "car")
                .font(.largeTitle)
                .foregroundStyle(.primary)
                .padding(8)
                .background(Color(.systemGray6))
                .clipShape(.capsule)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(parkingSpot.name)
                    .font(.headline)
                    .foregroundStyle(.primary)
                
                HStack(spacing: 8) {
                    Text("$\(parkingSpot.adjustedRate, specifier: "%.2f")/hr")
                        .foregroundStyle(parkingSpot.adjustedRate > parkingSpot.baseRate ? .red : .green)
                    
                    Spacer()
                    
                    Text("\(parkingSpot.spaces) spots")
                        .foregroundStyle(parkingSpot.spaces > 10 ? .green : .red)
                    
                    Spacer()
                    
                    HStack(spacing: 2) {
                        Image(systemName: "star")
                            .foregroundStyle(.yellow)
                        Text("\(parkingSpot.rating, specifier: "%.1f")")
                            .foregroundStyle(.secondary)
                    }
                }
                .font(.subheadline)
                .foregroundStyle(.secondary)
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .foregroundStyle(.gray)
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 16)
        .background(.white)
        .clipShape(.rect(cornerRadius: 8))
        .shadow(color: .black.opacity(0.05), radius: 3, x: 0, y: 2)
        .contentShape(Rectangle())
    }
}

#Preview {
    ParkingSpotRow(parkingSpot: ParkingSpot(
            id: 1,
            name: "Downtown Parking",
            position: "123 Main St",
            spaces: 50,
            baseRate: 5.0,
            adjustedRate: 6.5,
            availableTime: "24/7",
            rating: 4.5,
            factors: ParkingFactors(occupancyRate: 90, peakHours: true, weatherCondition: "rainy")
        ))
        .padding()
        .background(Color(.systemGray6))
}
