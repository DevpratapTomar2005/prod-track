import Card from "../components/Card.tsx";
import UserSolo from "../assets/user.svg";
import UserGroup from "../assets/user_group.svg";
const ChooseSignupRolePage = () => {
    const IndividualPerks: string[] = [
    "Detailed personal time tracking for every single task",
    "Assign tasks to specific projects and goals",
    "Gain insights with personal productivity graphs",
    "Track personal performance scores based on estimation and focus",
    "Review your own task calendar to plan your days",
    "Integrated dashboard for a clear, real-time overview of your productivity",
    "Export personal time and performance reports (PDF/Excel)",
  ];

    const OrganizationPerks: string[] = [
        "Everything in the Individual plan",
        "Unified time tracking across all team members and projects",
        "Manage multiple team projects and client accounts",
        "Powerful team-wide productivity and performance analytics",
        "Aggregate individual performance data into team reports",
        "Comprehensive exportable reports for payroll and invoicing",
        "Integrations with team tools like Slack, Discord, or Jira", 
    ]
  return (
    <>
     <div className="mt-30 w-full">
       <div className="mt-10">
            <div >
                <h1 className="text-5xl  font-bold text-neutral-800 text-center w-[55%] mx-auto">Choose Your <span className=" italic font-medium">"Path."</span></h1>
                
            </div>
            <div className="mx-auto w-[410px] h-1 bg-cyan-200 "></div>
           
        </div>
        <div className='w-[1000%] bg-gray-200 h-px relative left-[-10%] mt-15'></div>
        <div className="w-full grid grid-cols-2 divide-x  h-full overflow-y-hidden">
            <div className=" border-gray-200 h-full">
                <Card perks={IndividualPerks} img={UserSolo} title="Individual" subtitle="Maximize Your Own Productivity" buttonText="Browse Plans" btnLink="/auth/register/user"/>
            </div>
            
            <div className="h-full">
                <Card perks={OrganizationPerks} img={UserGroup} title="Organizations" subtitle="Scale Team Efficiency & Collaboration" buttonText="Browse Plans" btnLink="/auth/register/org"/>
            </div>
           
        </div>
    </div>
    <div className='w-[1000%] bg-gray-200 h-px mb-10 relative left-[-10%]'></div>
    </>
  )
}

export default ChooseSignupRolePage