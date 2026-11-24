import "./OpportunityDetail.css";
import type {Opportunity} from "../types";

type Props= {
opportunity: Opportunity;
onBack: () => void;
}
export default function OpportunityDetail( { opportunity, onBack }: Props) {
  return (
    

    <div className="opportunity-detail">
   <div className="detail-actions">
  <button className="detail-button" onClick={onBack}>Back</button>
  <button className="detail-button" onClick={onBack}>X</button>
</div>
      <div className="detail-heading">
        <h2 className="detail-description">{opportunity.description}</h2>
        <button className="detail-button">Save</button>
       </div>
      <p className = "detail-organization">{opportunity.organization}</p>
    
      <div className="detail-detail">
          <p>{opportunity.areas_of_interest}
            </p>

     </div>
    <a className="detail-button" href={opportunity.link} target="_blank" rel="noopener noreferrer">
  Register
</a>
    </div>
  );
}