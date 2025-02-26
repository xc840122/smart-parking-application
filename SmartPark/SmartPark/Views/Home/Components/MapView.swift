//
//  MapView.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import SwiftUI

struct MapView: View {
    var body: some View {
        Color.gray.opacity(0.1)
            .overlay {
                VStack(spacing: 8) {
                    Image(systemName: "map.fill")
                        .font(.system(size: 40))
                        .foregroundStyle(.black.opacity(0.3))
                    Text("Map View")
                        .foregroundStyle(.black.opacity(0.6))
                }
            }
    }
}

#Preview {
    MapView()
}
