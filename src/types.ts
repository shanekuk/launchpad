export type Opportunity = {
    id: string;
    organization: string;
    description: string;
    link: string;
    areas_of_interest: string; //comma separated
    lat: number;
    lng: number;
}