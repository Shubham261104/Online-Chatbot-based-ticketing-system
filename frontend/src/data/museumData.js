export const MUSEUM_DETAILS = {
  // India
  'National Museum': {
    desc: 'The National Museum in New Delhi is one of the largest museums in India. It holds a variety of articles ranging from pre-historic era to modern works of art.',
    famousFor: 'Harappan civilization artifacts, Buddhist art, and Miniature paintings.',
    location: 'Janpath, New Delhi, Delhi',
    mapUrl: 'https://www.google.com/maps/search/National+Museum+New+Delhi'
  },
  'National Rail Museum': {
    desc: 'This museum focuses on the rail heritage of India and has a huge outdoor collection of locomotives and coaches.',
    famousFor: 'Fairy Queen steam locomotive and various royal saloons.',
    location: 'Chanakyapuri, New Delhi, Delhi',
    mapUrl: 'https://www.google.com/maps/search/National+Rail+Museum+Delhi'
  },
  'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya': {
    desc: 'Formerly known as the Prince of Wales Museum, it is the main museum in Mumbai, housed in a magnificent Indo-Saracenic building.',
    famousFor: 'Natural history collection, ancient Indian ceramics, and Tibetan art.',
    location: 'Fort, Mumbai, Maharashtra',
    mapUrl: 'https://www.google.com/maps/search/Chhatrapati+Shivaji+Maharaj+Vastu+Sangrahalaya'
  },
  'Indian Museum': {
    desc: 'Founded in 1814, it is the oldest and largest museum in India and the ninth oldest museum in the world.',
    famousFor: 'Egyptian mummy, Buddhist stupa from Bharhut, and Ashoka pillar.',
    location: 'Jawaharlal Nehru Road, Kolkata, West Bengal',
    mapUrl: 'https://www.google.com/maps/search/Indian+Museum+Kolkata'
  },
  'Victoria Memorial Hall': {
    desc: 'A large marble building in Kolkata, built between 1906 and 1921, dedicated to the memory of Queen Victoria.',
    famousFor: 'British colonial architecture, Royal Gallery, and vast gardens.',
    location: 'Queens Way, Kolkata, West Bengal',
    mapUrl: 'https://www.google.com/maps/search/Victoria+Memorial+Kolkata'
  },
  'Salar Jung Museum': {
    desc: 'An art museum located at Dar-ul-Shifa, on the southern bank of the Musi River in the city of Hyderabad.',
    famousFor: 'Veiled Rebecca statue, Musical Clock, and ivory carvings.',
    location: 'Hyderabad, Telangana',
    mapUrl: 'https://www.google.com/maps/search/Salar+Jung+Museum'
  },
  'Visvesvaraya Industrial and Technological Museum': {
    desc: 'A constituent unit of the National Council of Science Museums, it is a pioneer in science popularization.',
    famousFor: 'Interactive science exhibits, Wright Brothers aeroplane replica.',
    location: 'Kasturba Road, Bangalore, Karnataka',
    mapUrl: 'https://www.google.com/maps/search/Visvesvaraya+Museum+Bangalore'
  },
  'Government Museum Chennai': {
    desc: 'Also known as the Madras Museum, it is the second oldest museum in India.',
    famousFor: 'Bronze Gallery with Chola period bronzes, Amaravati sculptures.',
    location: 'Egmore, Chennai, Tamil Nadu',
    mapUrl: 'https://www.google.com/maps/search/Government+Museum+Chennai'
  },
  'Albert Hall Museum': {
    desc: 'The oldest museum of Rajasthan, functioning as the state museum, it is a fine example of Indo-Saracenic architecture.',
    famousFor: 'Egyptian mummy, blue pottery, and carpet collection.',
    location: 'Jaipur, Rajasthan',
    mapUrl: 'https://www.google.com/maps/search/Albert+Hall+Museum+Jaipur'
  },
  'Bihar Museum': {
    desc: 'A modern museum in Patna that showcases the history and culture of Bihar from ancient times.',
    famousFor: 'Didarganj Yakshi, world-class architecture, and interactive historical galleries.',
    location: 'Patna, Bihar',
    mapUrl: 'https://www.google.com/maps/search/Bihar+Museum+Patna'
  },

  // World
  'Louvre Museum': {
    desc: 'The world\'s largest art museum and a historic monument in Paris, France.',
    famousFor: 'Mona Lisa, Venus de Milo, and the Winged Victory of Samothrace.',
    location: 'Paris, France',
    mapUrl: 'https://www.google.com/maps/search/Louvre+Museum'
  },
  'Metropolitan Museum of Art': {
    desc: 'The largest art museum in the United States, located in New York City.',
    famousFor: 'Temple of Dendur, European masterpieces, and American wing.',
    location: 'New York City, USA',
    mapUrl: 'https://www.google.com/maps/search/Metropolitan+Museum+of+Art'
  },
  'British Museum': {
    desc: 'A public institution dedicated to human history, art and culture, located in London.',
    famousFor: 'Rosetta Stone, Elgin Marbles, and Egyptian mummies.',
    location: 'London, UK',
    mapUrl: 'https://www.google.com/maps/search/British+Museum'
  },
  'Vatican Museums': {
    desc: 'Public art and sculpture museums in the Vatican City, displaying works from the immense collection amassed by the Catholic Church.',
    famousFor: 'Sistine Chapel ceiling, Raphael Rooms, and Laocoön statue.',
    location: 'Vatican City, Italy',
    mapUrl: 'https://www.google.com/maps/search/Vatican+Museums'
  },
  'Prado Museum': {
    desc: 'The main Spanish national art museum, located in central Madrid.',
    famousFor: 'Las Meninas by Velázquez, works by Goya and El Greco.',
    location: 'Madrid, Spain',
    mapUrl: 'https://www.google.com/maps/search/Prado+Museum'
  }
};

export const getMuseumInfo = (name) => {
  return MUSEUM_DETAILS[name] || {
    desc: 'A significant cultural institution preserving history and heritage for future generations.',
    famousFor: 'Historical artifacts and cultural exhibitions.',
    location: 'Local Region',
    mapUrl: `https://www.google.com/maps/search/${encodeURIComponent(name)}`
  };
};
