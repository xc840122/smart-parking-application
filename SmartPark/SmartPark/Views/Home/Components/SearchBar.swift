//
//  SearchBar.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import SwiftUI

struct SearchBar: View {
    @Binding var searchText: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(.gray)
            TextField("Search parking lots by name, location, or keyword", text: $searchText)
                .padding(8)
                .background(Color(.systemGray6))
                .clipShape(.rect(cornerRadius: 8))
                .autocorrectionDisabled(true)
                .textInputAutocapitalization(.none)
        }
        .padding(.horizontal)
        .padding(.vertical, 8.0)
        .background(.white)
        .clipShape(.rect(cornerRadius: 10))
    }
}

#Preview {
    SearchBar(searchText: .constant(""))
}
