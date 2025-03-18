//
//  UnavailableView.swift
//  SmartPark
//
//  Created by 阿福 on 18/03/2025.
//

import SwiftUI

struct UnavailableView: View {
    var title: String
    var subtitle: String
    var systemImage: String

    var body: some View {
        VStack {
            Image(systemName: systemImage)
                .resizable()
                .scaledToFit()
                .frame(width: 80, height: 80)
                .foregroundColor(.gray)
                .padding(.top, 50)

            Text(title)
                .font(.headline)
                .foregroundColor(.gray)
                .padding(.top, 20)

            Text(subtitle)
                .font(.subheadline)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.white)
        .cornerRadius(10)
        .padding(.top, 50)
    }
}

#Preview {
    UnavailableView(title: "Warning", subtitle: "Something went wrong", systemImage: "exclamationmark.triangle")
}
