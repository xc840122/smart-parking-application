//
//  SortingBar.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import SwiftUI

enum SortOption: String, CaseIterable {
    case distance = "Distance"
    case rating = "Rating"
    case price = "Price"
}

struct SortingBar: View {
    @Binding var selectedFilter: SortOption
    @Binding var isMapView: Bool
    
    var body: some View {
        HStack {
            Picker("Filter", selection: $selectedFilter) {
                ForEach(SortOption.allCases, id: \.self) { option in
                    Text(option.rawValue)
                        .tag(option)
                }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)
            
            Spacer()
            
            Button {
                isMapView.toggle()
            } label: {
                Image(systemName: isMapView ? "list.bullet" : "map")
                    .font(.title2)
                    .foregroundStyle(.black)
                    .padding(8)
            }
            .padding(.trailing, 16)
        }
        .padding(.top, 10)
    }
}

#Preview {
    SortingBar(selectedFilter: .constant(.distance), isMapView: .constant(false))
}
