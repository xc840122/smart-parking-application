//
//  HomeViewModel.swift
//  SmartPark
//
//  Created by 阿福 on 26/02/2025.
//

import Foundation

@Observable
class HomeViewModel {
    var searchText = ""
    var isMapView = false
    var selectedFilter: SortOption = .distance
}
