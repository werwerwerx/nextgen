export interface Feature {
  name: string
  description: string
  source: string
}

export interface Reason {
  claim: string
  author: string
  source: string
}

export interface Testimonial {
  text: string
  author: string
  source: string
  date: string
}

export interface WhoWeAre {
  title: string
  subtitle: string
  features: Feature[]
}

export interface WhyItWorks {
  title: string
  subtitle: string
  reasons: Reason[]
}

export interface ContentResources {
  who_we_are: WhoWeAre
  why_it_works: WhyItWorks
  testimonials: Testimonial[]
} 