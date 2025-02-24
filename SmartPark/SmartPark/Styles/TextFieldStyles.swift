//
//  TextFieldStyles.swift
//  SmartPark
//
//  Created by 阿福 on 24/02/2025.
//

import SwiftUI

enum TextFieldStyles {
    struct Notion: TextFieldStyle {
        func _body(configuration: TextField<Self._Label>) -> some View {
            configuration
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 3)
                        .stroke(.gray.opacity(0.2), lineWidth: 1)
                        .background(.white)
                )
                .clipShape(RoundedRectangle(cornerRadius: 3))
        }
    }
}
