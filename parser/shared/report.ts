import { MainCourse, NewCource } from "./course";


export class ParseError extends Error {
  url: string;
  title: string;
  clientErrorMessage: string;

  constructor(parsingError: CourseParsingError) {
    super(parsingError.error);
    this.name = 'ParseError';
    this.url = parsingError.url;
    this.title = parsingError.title;
    this.clientErrorMessage = parsingError.clientErrorMessage;
  }
}

export class DatabaseError extends Error {
  clientErrorMessage: string;

  constructor(databaseError: CourseDatabaseError) {
    super(databaseError.error);
    this.name = 'DatabaseError';
    this.clientErrorMessage = databaseError.clientErrorMessage;
  }
}

export type CourseParsingError = {
  url: string;
  title: string;
  error: string;
  clientErrorMessage: string;
}

export type CourseDatabaseError = {
  error: string;
  clientErrorMessage: string;
}

export type ParseReport = {
  duration: number; // in milliseconds
  stats: {
    totalLinksParsed: number;
    updatedInDb: number;
  };
  errors: {
    parsing: CourseParsingError[];
    database?: DatabaseError;
    other?: string;
  };
  performance: {
    averageParseTime: number; // ms per course
    totalParseTime: number;
  };
}