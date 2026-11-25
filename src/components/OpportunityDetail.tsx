import "./OpportunityDetail.css";
import type {Opportunity} from "../types";
import {getCauseStyle, splitAreas} from "../utils/causes";
type Props= {
opportunity: Opportunity;
onBack: () => void;
}
export default function OpportunityDetail( { opportunity, onBack }: Props) {
  const {color} = getCauseStyle(opportunity.areas_of_interest);
  const areas = splitAreas(opportunity.areas_of_interest);
  return (
    

    <div className="opportunity-detail">
      
      <div className="detail-actions">
  <button className="detail-button" onClick={onBack}>Back to results</button>
  <button className="detail-button" onClick={onBack} aria-label="Close">X</button>
</div>
      <div className="detail-heading">
        <h2 className="detail-description">{opportunity.description}</h2>
        <button className="detail-button">Save</button>
       </div>
      <p className = "detail-organization">{opportunity.organization}</p>
    <div className="detail-tags">
  {areas.map((area) => (
    <span
      key={area}
      className="detail-tag"
      style={{ border: `1px solid ${color}`, color }}
    >
      {area}
    </span>
  ))}
</div>

    <a className="detail-button" href={opportunity.link} target="_blank" rel="noopener noreferrer">
  Register
</a>
    </div>
  );
}