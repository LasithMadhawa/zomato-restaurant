import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";
import { City } from "./city.model";
import { Restaurant } from "./restaurant.model";

@Injectable({ providedIn: "root" })
export class RestaurantService {
  private restaurants: Restaurant[] = [];
  private restaurantsFiltered = new Subject<Restaurant[]>();
  private locations: City[] = [];
  private locationsFiltered = new Subject<City[]>();

  constructor(private http: HttpClient) {}

  private key = "19ef7d186de6eb9f9aa003be463a2c78";
  private headers = new HttpHeaders().set("user-key", this.key);

  getCities(city: string) {
    this.locations = [];
    this.http
      .get<{
        location_suggestions: City[];
        status: string;
        has_more: number;
        has_total: number;
      }>(
        "https://developers.zomato.com/api/v2.1/cities?q=" + city + "&count=10",
        {
          headers: this.headers
        }
      )
      .subscribe(response => {
        // console.log(response.location_suggestions);
        this.locations = response.location_suggestions;
        this.locationsFiltered.next([...this.locations]);
      });
  }

  getLocationFilteredListener() {
    return this.locationsFiltered.asObservable();
  }

  getRestaurants(city: string) {
    let filteredCity: City;
    this.http
      .get<{
        location_suggestions: City[];
        status: string;
        has_more: number;
        has_total: number;
      }>(
        "https://developers.zomato.com/api/v2.1/cities?q=" + city + "&count=1",
        {
          headers: this.headers
        }
      )
      .subscribe(response => {
        // console.log(response.location_suggestions);
        filteredCity = response.location_suggestions[0];
        console.log(filteredCity.id);
        this.http
          .get<{ restaurants: { restaurant: Restaurant }[] }>(
            "https://developers.zomato.com/api/v2.1/search?entity_id=" +
              filteredCity.id +
              "&entity_type=city&count=10",
            { headers: this.headers }
          )
          .subscribe(response => {
            this.restaurants = [];
            response.restaurants.forEach(rest => {
              this.restaurants.push(rest.restaurant);
            });
            // console.log(response.restaurants[0].restaurant);
            // console.log(this.restaurants);
            // this.restaurants = response.restaurants;
            this.restaurantsFiltered.next([...this.restaurants]);
          });
      });
  }

  getRestaurantsFilteredListener() {
    return this.restaurantsFiltered.asObservable();
  }
}
