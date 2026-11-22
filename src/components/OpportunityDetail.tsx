import "./OpportunityDetail.css";
type Opportunity = {
  id: string;
  title: string;
  organization: string;
  date: string;
  time: string;
  location: string;
  register_link: string;

}
type Props= {
opportunity: Opportunity;
onBack: () => void;
}
export default function OpportunityDetail( { opportunity, onBack }: Props) {
  return (
    

    <div className="opportunity-detail">
   <div className="detail-actions">
  <button className="detail-button" onClick={onBack}>Back</button>
  <button className="detail-button"onClick={onBack}>X</button>
</div>
      <div className="detail-heading">
        <h2 className="detail-title">{opportunity.title}</h2>
        <button className="detail-button">Save</button>
       </div>
      <p className = "detail-description">{opportunity.organization}</p>
    
      <div className="detail-detail">
          <p>{opportunity.date}</p>
          <p> {opportunity.time}</p>
          <p> {opportunity.location}</p>

     </div>
    <a className="detail-button" href={opportunity.register_link} target="_blank" rel="noopener noreferrer">
  Register
</a>
    </div>
  );
}