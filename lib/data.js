export const SITE = {
  name: 'Pink Paws Groomers',
  tagline: 'Life is Beautiful...',
  location: 'Lekki, Lagos, Nigeria',
  established: 2014,
};

export const SERVICES = [
  {
    slug: 'customer-service-consulting',
    name: 'Customer Service Consulting',
    short: 'Better customer experience, clearer service standards, stronger customer relationships.',
    desc: 'We help organisations improve the way they serve their customers. The focus is on customer experience, service standards, customer relationships and day to day service delivery.',
    relevance: 'How customers experience an organisation shapes loyalty, reputation and repeat business. Clear standards and consistent delivery make that experience dependable.',
    points: ['Customer experience', 'Service standards', 'Customer relationships', 'Service delivery'],
  },
  {
    slug: 'attitude-development',
    name: 'Attitude Development',
    short: 'Positive workplace attitudes, professional conduct and people development.',
    desc: 'We support organisations that want to build positive workplace attitudes, professional conduct and constructive employee behaviour, with people development at the centre.',
    relevance: 'Attitudes and conduct show up in every customer interaction and every team relationship. Developing them supports a healthier workplace and better service.',
    points: ['Workplace attitudes', 'Professional conduct', 'Employee behaviour', 'People development'],
  },
  {
    slug: 'business-and-ngo-start-up',
    name: 'Business and NGO Start-up',
    short: 'Consulting support for people and organisations setting up a business or an NGO.',
    desc: 'We provide consulting support for individuals and organisations that are establishing a new business or NGO.',
    relevance: 'Early decisions on purpose, structure and direction affect how well a new organisation can grow. Structured support helps founders make those decisions with more clarity.',
    points: ['Business start-up', 'NGO start-up', 'Early structure and direction'],
  },
  {
    slug: 'strategy-and-sustainability',
    name: 'Strategy and Sustainability',
    short: 'Strategic direction, organisational development and sustainable growth.',
    desc: 'We help organisations set strategic direction, develop the organisation itself and plan for growth that can be sustained over time.',
    relevance: 'Organisations that know where they are heading, and how they will sustain it, can plan resources and priorities with more confidence.',
    points: ['Strategic direction', 'Organisational development', 'Sustainable business growth'],
  },
];

export const SERVICE_NAMES = SERVICES.map((s) => s.name);

export const APPROACH = [
  ['Understand the organisation', 'We start by learning about the organisation, its people and what it needs.'],
  ['Identify challenges and opportunities', 'We work out what is getting in the way and where the openings are.'],
  ['Develop recommendations', 'We turn what we learned into clear, practical recommendations.'],
  ['Support implementation where agreed', 'Where the client wants it, we help put the recommendations into practice.'],
  ['Review progress', 'We look back at what has changed and what still needs attention.'],
];

// Add photography by dropping files in /public/images and setting the paths below.
// While a path is null, a branded panel is shown instead.
export const IMAGES = {
  hero: null,
  about: null,
  'customer-service-consulting': null,
  'attitude-development': null,
  'business-and-ngo-start-up': null,
  'strategy-and-sustainability': null,
};

export const DEFAULTS = {
  hero_headline: 'Building Better Organisations Through People, Strategy and Sustainable Growth.',
  hero_text: 'We help businesses and organisations strengthen customer service, develop people, establish businesses and NGOs, and create strategic direction for sustainable growth.',
  brand_statement: 'Helping organisations build better businesses, develop people, improve customer experiences, and create sustainable growth.',
  about_company: 'Pink Paws Groomers is a diverse consulting firm focused on customer service, attitude development, business and NGO start-up, strategy and sustainability. Established in 2014 and based in Lekki, Lagos, the firm supports businesses and organisations that want to build better, serve better and grow with purpose.',
  mission: 'To help organisations build better businesses, develop their people and improve the experience they give their customers.',
  vision: 'Organisations that grow sustainably through capable people, clear strategy and excellent customer experiences.',
  values: 'Professionalism\nIntegrity\nPeople first\nClarity\nSustainability',
  service_0_desc: SERVICES[0].desc,
  service_1_desc: SERVICES[1].desc,
  service_2_desc: SERVICES[2].desc,
  service_3_desc: SERVICES[3].desc,
};

export function slugify(t) {
  return String(t).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
