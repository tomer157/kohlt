/**
 *  Builder pattern to crate big objects
 * the use the factory pattern to fetch
 *
 */

class Vehicle {
  constructor(name) {
    this.name = name;
  }
}

class Car {
  constructor(name) {
    this.name = name;
  }
}

// now lets build....
class VehicleBuilder {
  constructor(name) {
    this.vehicle = new Vehicle(name);
  }

  setCar(name) {
    this.vehicle.car = new Car(name);
    return this;
  }

  setProduct(product) {
    this.vehicle.name.product = product;
    return this;
  }

  build() {
    return this.vehicle;
  }
}

// now the factory
const create = (type) => {
  switch (type) {
    case 'Car':
      return new VehicleBuilder('Car')
        .setCar('chevi')
        .setProduct('hc1')
        .build();

      break;

    default:
      break;
  }
};

module.exports = { create };
