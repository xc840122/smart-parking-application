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
                .background(Color(uiColor: .tertiarySystemBackground)) // ✅ 更好的适配深色模式
                .clipShape(Circle())

            VStack(alignment: .leading, spacing: 4) {
                Text(parkingSpot.name)
                    .font(.headline)
                    .foregroundStyle(.primary)

                Text("\(parkingSpot.area), \(parkingSpot.city)")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)

                HStack(spacing: 8) {
                    Text("$\(parkingSpot.pricePerHour)/hr")
                        .foregroundStyle(.blue)
                        .bold() // ✅ 让价格更醒目

                    Spacer()

                    Text("\(parkingSpot.availableSlots)/\(parkingSpot.totalSlots) spots")
                        .foregroundStyle(parkingSpot.availableSlots > 5 ? .green : .red)

                    Spacer()

                    Text(parkingSpot.street)
                        .foregroundStyle(.secondary)
                }
                .font(.subheadline)
                .frame(maxWidth: .infinity) // ✅ 保证 `Spacer()` 均匀分布
            }

            Spacer()

            Image(systemName: "chevron.right")
                .foregroundStyle(.gray)
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 16)
        .background(Color(uiColor: .systemBackground)) // ✅ 适配暗黑模式
        .clipShape(RoundedRectangle(cornerRadius: 8)) // ✅ 兼容性更强
        .shadow(color: .black.opacity(0.05), radius: 3, x: 0, y: 2)
        .contentShape(Rectangle())
    }
}

#Preview {
    ParkingSpotRow(parkingSpot: ParkingSpot(
        _id: "preview",
        _creationTime: Date().timeIntervalSince1970,
        name: "Downtown Parking",
        area: "Downtown",
        city: "Los Angeles",
        street: "Main St",
        unit: "Unit 1",
        availableSlots: 10,
        totalSlots: 20,
        pricePerHour: 8,
        location: Location(lat: 34.0522, lng: -118.2437),
        isActive: true
    ))
    .padding()
    .background(Color(.systemGray6))
}
