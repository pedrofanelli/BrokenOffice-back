const { db_sync } = require("../config/db");
const { User, Office } = require("../models");

async function addUsers(users) {
  for (const user of users) {
    await User.create(user);
  }
}

function sortAddresses(streets, cities) {
  const randomName = Math.floor(Math.random() * 20);
  const randomNumber = Math.floor(Math.random() * (3000 - 10 + 1)) + 10;
  return `${streets[randomName]} ${randomNumber}, ${cities[randomName]}`;
}

function randomLat() {
  return parseFloat((Math.random() * (-54 - -21) + -21).toFixed(8));
}
function randomLong() {
  return parseFloat((Math.random() * (-70 - -53) + -53).toFixed(8));
}

const seedUserOffices = async () => {
  const users = [
    {
      name: "Super Admin",
      lastName: "Owner",
      type: "superAdmin",
      role: "superAdmin",
      password: "brokenoffice123",
      email: "superadmin@globant.com",
      addressName:
        "Av. Santa Fe 877, Rosario, Provincia de Santa Fe, Argentina",
      addressCoor: {
        type: "Point",
        coordinates: [-62.261036, -38.709426],
      },
    },
    {
      name: "Admin",
      lastName: "lite",
      type: "admin",
      role: "admin",
      password: "brokenoffice123",
      email: "admin@globant.com",
      addressName:
        "Rodríguez 66, Necochea, Provincia de Buenos Aires, Argentina",
      addressCoor: {
        type: "Point",
        coordinates: [-60.27640501877847, -38.38154544145026],
      },
    },
    {
      name: "Standard",
      lastName: "Staff",
      type: "standard",
      role: "Staff",
      password: "brokenoffice123",
      email: "standard@globant.com",
      addressName: "Alem 1777, Azul, Prov. Bs As, Argentina",
      addressCoor: {
        type: "Point",
        coordinates: [-31.400418168552886, -64.22622374454102],
      },
    },
  ];

  const offices = [
    {
      name: "Bahia Blanca",
      address: {
        street: "Dr. Luis María Drago 45",
        zip: "B8000DCA",
        floor: "9° piso",
      },
      location: {
        type: "Point",
        coordinates: [-62.26707802202223, -38.71961235719416],
      },
    },

    {
      name: "Buenos Aires",
      address: {
        street: "Carlos M. Della Paolera 261, CABA",
        zip: "C1001ADA",
        floor: "",
      },
      location: {
        type: "Point",
        coordinates: [-58.37107472919439, -34.595164849778385],
      },
    },

    {
      name: "Cordoba",
      address: {
        street: "Av. Colón 3440, esquina Zipoli. Barrio Alto Alberdi",
        zip: "5003",
        floor: "",
      },
      location: {
        type: "Point",
        coordinates: [-64.22622374454102, -31.400418168552886],
      },
    },

    {
      name: "La Plata",
      address: {
        street: "Calle 6 N°572",
        zip: "B1902CLX",
        floor: "1° piso",
      },
      location: {
        type: "Point",
        coordinates: [-57.954606433887214, -34.909168831879626],
      },
    },

    {
      name: "Mar del Plata",
      address: {
        street: "Avenida Colón 1114",
        zip: "B7600FXR",
        floor: "",
      },
      location: {
        type: "Point",
        coordinates: [-57.535591359322616, -38.01079581604551],
      },
    },
    {
      name: "Ushuaia",
      address: {
        street: "C. Onas 223",
        zip: "V9410",
        floor: "piso 5",
      },
      location: {
        type: "Point",
        coordinates: [-68.31899351489317, -54.808711367401585],
      },
    },
    {
      name: "Tucumán",
      address: {
        street: "Av. Juan Domingo Perón 2300,",
        zip: "T4107",
        floor: "",
      },
      location: {
        type: "Point",
        coordinates: [-65.30305880116478, -26.799265029344973],
      },
    },
    {
      name: "Tandil",
      address: {
        street: "General Paz 539",
        zip: "B7000",
        floor: "",
      },
      location: {
        type: "Point",
        coordinates: [-59.13066882171529, -37.32496190735314],
      },
    },
    {
      name: "Rosario",
      address: {
        street: "Gral. Alvear 1670",
        zip: "S2000QGR",
        floor: "",
      },
      location: {
        type: "Point",
        coordinates: [-60.657478, -32.953828],
      },
    },
    {
      name: "Rosario",
      address: {
        street: "Madres de Plaza 25 de Mayo 3020",
        zip: "S2000QGR",
        floor: "",
      },
      location: {
        type: "Point",
        coordinates: [-60.66068869022631, -32.926363502244996],
      },
    },
    {
      name: "Resistencia",
      address: {
        street: "Pte. Dr. Arturo Frondizi 174",
        zip: "H3500CAD",
        floor: "5° piso",
      },
      location: {
        type: "Point",
        coordinates: [-58.97729540815109, -27.461998145014306],
      },
    },
    {
      name: "Mendoza",
      address: {
        street: "Montevideo 230",
        zip: "M5500GGF",
        floor: "5° piso",
      },
      location: {
        type: "Point",
        coordinates: [-68.8432275172835, -32.89242561164258],
      },
    },
    {
      name: "Mendoza",
      address: {
        street: "Gutierrez 50",
        zip: "M5500GGF",
        floor: "1° piso",
      },
      location: {
        type: "Point",
        coordinates: [-68.83951027310734, -32.88828635707043],
      },
    },
    {
      name: "Mendoza",
      address: {
        street: "Darragueira 7097",
        zip: "M5505",
        floor: "1° piso",
      },
      location: {
        type: "Point",
        coordinates: [-68.8757536732037, -32.97147011018864],
      },
    },
  ];

  const service = {
    name: "Service",
    lastName: "Staff",
    type: "service",
    role: "Staff",
    password: "brokenoffice123",
    email: "service@globant.com",
    addressName: "",
    addressCoor: {
      type: "Point",
      coordinates: [-58.491312221578376, -34.55325568133285],
    },
    office: "",
  };

  const streets = [
    "Av. Santa Fe",
    "Av. Cabildo",
    "Av. Corrientes",
    "Av. Rivadavia",
    "Av. 9 de Julio",
    "Av. Libertador",
    "Florida",
    "Reconquista",
    "Bartolomé Mitre",
    "Esmeralda",
    "Paraguay",
    "Suipacha",
    "Tucumán",
    "Uruguay",
    "Viamonte",
    "Sarmiento",
    "Lavalle",
    "Carlos Pellegrini",
    "Marcelo T. de Alvear",
    "Alem"
  ];
  
  const cities = [
    "Córdoba, Córdoba, Argentina",
    "Salta, Salta, Argentina",
    "Rosario, Santa Fe, Argentina",
    "Mendoza, Mendoza, Argentina",
    "San Miguel de Tucumán, Tucumán, Argentina",
    "La Plata, Buenos Aires, Argentina",
    "Bahía Blanca, Buenos Aires, Argentina",
    "Corrientes, Corrientes, Argentina",
    "San Salvador de Jujuy, Jujuy, Argentina",
    "Neuquén, Neuquén, Argentina",
    "Formosa, Formosa, Argentina",
    "Posadas, Misiones, Argentina",
    "San Carlos de Bariloche, Río Negro, Argentina",
    "Santa Rosa, La Pampa, Argentina",
    "San Luis, San Luis, Argentina",
    "Ushuaia, Tierra del Fuego, Argentina",
    "Comodoro Rivadavia, Chubut, Argentina",
    "Rawson, Chubut, Argentina",
    "Viedma, Río Negro, Argentina",
    "La Rioja, La Rioja, Argentina",
  ];

  try {
    await db_sync();
    let count = 0;
    for (let i = 0; i < offices.length; i++) {
      const office = await Office.create(offices[i]);
      service.office = office._id;
      count += 1;
      service.email = `service${count}@globant.com`;
      service.name = `Service${count}`;
      service.addressName = sortAddresses(streets, cities);
      service.addressCoor = {
        type: "Point",
        coordinates: [randomLong(), randomLat()],
      };
      await User.create(service);
      count += 1;
      service.email = `service${count}@globant.com`;
      service.name = `Service${count}`;
      service.addressName = sortAddresses(streets, cities);
      service.addressCoor = {
        type: "Point",
        coordinates: [randomLong(), randomLat()],
      };
      await User.create(service);
      count += 1;
      service.email = `service${count}@globant.com`;
      service.name = `Service${count}`;
      service.addressName = sortAddresses(streets, cities);
      service.addressCoor = {
        type: "Point",
        coordinates: [randomLong(), randomLat()],
      };
      await User.create(service);
    }
    await addUsers(users);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
};

seedUserOffices();
