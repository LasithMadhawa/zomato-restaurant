import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { RestaurantService } from "./restaurant.service";
import { City } from "./city.model";
import { Restaurant } from "./restaurant.model";

@Component({
  selector: "app-restaurant-search",
  templateUrl: "./restaurant-search.component.html",
  styleUrls: ["./restaurant-search.component.css"]
})
export class RestaurantSearchComponent implements OnInit, OnDestroy {
  constructor(private restaurantService: RestaurantService) {}

  myControl = new FormControl();
  restaurants: Restaurant[] = [];
  cities: City[] = [];
  options: string[] = [];
  selectedCity = "";
  private locationSub: Subscription;
  private restaurantSub: Subscription;

  ngOnInit() {}

  onInput() {
    // console.log(this.myControl.value);
    this.restaurantService.getCities(this.myControl.value);
    this.locationSub = this.restaurantService
      .getLocationFilteredListener()
      .subscribe(cities => {
        this.options = [];
        this.cities = [];
        cities.forEach(city => {
          this.options.push(city.name);
        });
      });
  }

  onSearch(city: string) {
    this.selectedCity = city;
    this.restaurantService.getRestaurants(city);
    this.restaurantSub = this.restaurantService
      .getRestaurantsFilteredListener()
      .subscribe(restaurants => {
        this.restaurants = [];
        this.restaurants = restaurants;
        // console.log(restaurants);
      });
  }

  ngOnDestroy() {
    this.restaurantSub.unsubscribe();
    this.locationSub.unsubscribe();
  }
}
