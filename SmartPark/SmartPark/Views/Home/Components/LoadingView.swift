//
//  LoadingView.swift
//  SmartPark
//
//  Created by 阿福 on 18/03/2025.
//

import SwiftUI

struct LoadingView: View {
    var title: String
    
    var body: some View {
        ZStack {
            Color.black.opacity(0.4)
                .ignoresSafeArea()
            ProgressView(title)
                .padding()
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .shadow(radius: 10)
        }
    }
}

#Preview {
    LoadingView(title: "Loading...")
}
