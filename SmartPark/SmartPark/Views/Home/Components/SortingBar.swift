//
//  SortingBar.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import SwiftUI

struct SortingBar: View {
    @Bindable var viewModel: ParkingSpotViewModel

    var body: some View {
        HStack(spacing: 8) {
            // 城市选择
            dropdownButton(title: viewModel.selectedCity ?? "City",
                           items: viewModel.cities,
                           isEnabled: !viewModel.cities.isEmpty) { city in
                viewModel.selectedCity = city
                viewModel.selectedArea = nil
                viewModel.selectedStreet = nil
                Task {
                    await viewModel.fetchAreas(for: city)
                }
            }

            // 区域选择（可选）
            dropdownButton(title: viewModel.selectedArea ?? "Area",
                           items: viewModel.areas,
                           isEnabled: !viewModel.areas.isEmpty) { area in
                viewModel.selectedArea = area
                viewModel.selectedStreet = nil
                Task {
                    await viewModel.fetchStreets(for: area)
                }
            }

            
            dropdownButton(title: viewModel.selectedStreet ?? "Street",
                           items: viewModel.streets,
                           isEnabled: !viewModel.streets.isEmpty) { street in
                viewModel.selectedStreet = street
            }

            Button(action: {
                Task {
                    await viewModel.searchParkingLots()
                }
            }) {
                Image(systemName: "magnifyingglass")
                    .font(.title2)
                    .foregroundColor(viewModel.selectedCity != nil ? .black : .gray)
                    .padding(8)
                    .background(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .disabled(viewModel.selectedCity == nil)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(.white)
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
    
    private func dropdownButton(title: String, items: [String], isEnabled: Bool, action: @escaping (String) -> Void) -> some View {
        Menu {
            ForEach(items, id: \.self) { item in
                Button {
                    action(item)
                } label: {
                    Text(item)
                }
            }
        } label: {
            HStack {
                Text(title)
                    .foregroundColor(isEnabled ? .black : .gray)
                    .padding(.leading, 6)
                Image(systemName: "chevron.down")
                    .font(.system(size: 14))
                    .foregroundColor(isEnabled ? .gray : .clear)
            }
            .frame(height: 40)
            .frame(maxWidth: 100)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(isEnabled ? Color.black : Color.gray.opacity(0.3), lineWidth: 1)
            )
        }
        .disabled(!isEnabled)
    }
}

#Preview {
    SortingBar(viewModel: ParkingSpotViewModel())
}
