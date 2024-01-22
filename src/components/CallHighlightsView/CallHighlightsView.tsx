import { CallSummary } from "utils/callSummary";
import { getClassNames } from "./CallHighlightsView.classNames";

interface CallHighlightsViewProps {
  callSummary: CallSummary | undefined;
}

function CallHighlightsView({
  callSummary
}: CallHighlightsViewProps) {
  if (callSummary === undefined) return (<div></div>);

  const classNames = getClassNames();

  return (
    <div>
      <div className={classNames.area}>
        <h2>Conversation Summary</h2>
        {callSummary.summary}
        <br/><br/>
      </div>
      <br/>
      <div className={classNames.area}>
        <h2>Call Highlights</h2>
        <h3>Overall Sentiment</h3>
        {callSummary.overallSentiment}
        <h3>Category</h3>
        {callSummary.category}
        <h3>Entities Recognized</h3>
        <b>Companies: </b>
        <ul>
          {callSummary.companies && callSummary.companies.map((company, index) => (
            <li key={index}>{company}</li>
          ))}
        </ul>
        <b>People & titles:</b>
        <ul>
          {callSummary.people && callSummary.people.map((person, index) => (
            <li key={index}>{person}</li>
          ))}
        </ul>
        <h3>Key Discussion Topics</h3>
        <ul>
          {callSummary.topics && callSummary.topics.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
        <h3>Key Items</h3>
        <ul>
          {callSummary.keyItems && callSummary.keyItems.map((item, index) => (
            <li key={index}>{item.itemName}: {item.itemValue}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CallHighlightsView;