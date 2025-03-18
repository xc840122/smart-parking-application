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
        VStack {
            HStack {
                Image(systemName: "car")
                    .font(.largeTitle)
                    .foregroundStyle(.primary)
                    .padding(8)
                    .background(Color(uiColor: .tertiarySystemBackground))
                    .clipShape(Circle())

                VStack(alignment: .leading, spacing: 4) {
                    Text(parkingSpot.name)
                        .font(.subheadline)
                        .bold()
                        .foregroundStyle(.primary)

                    Text("📍\(parkingSpot.area), \(parkingSpot.city)")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                }

                Spacer()

                Image(systemName: "chevron.right")
                    .foregroundStyle(.gray)
            }
            
            HStack(spacing: 8) {
                Text("$\(String(format: "%.2f", parkingSpot.pricePerHour))/hr")
                    .foregroundStyle(.blue)
                    .bold()

                Spacer()

                Text("\(parkingSpot.availableSlots)/\(parkingSpot.totalSlots) spots")
                    .foregroundStyle(parkingSpot.availableSlots > 5 ? .green : .red)

                Spacer()

                Text(parkingSpot.street)
                    .foregroundStyle(.secondary)
            }
            .font(.subheadline)
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 16)
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 16)
        .background(Color(uiColor: .systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .shadow(color: .black.opacity(0.05), radius: 3, x: 0, y: 2)
        .contentShape(Rectangle())
    }
}

#Preview {
    ParkingSpotRow(parkingSpot: ParkingSpot(
        id: "preview",
        creationTime: Date().timeIntervalSince1970,
        name: "Downtown Parking",
        area: "Downtown",
        city: "Los Angeles",
        street: "Main St",
        unit: "Unit 1",
        availableSlots: 10,
        totalSlots: 20,
        pricePerHour: 8,
        location: PLocation(lat: 34.0522, lng: -118.2437),
        isActive: true
    ))
    .padding()
    .background(Color(.systemGray6))
}
