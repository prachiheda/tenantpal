import os
from dotenv import load_dotenv
from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task

# Load environment variables (Groq key still needed for LLM)
load_dotenv()

# --- Initialize Groq LLM for Agent Reasoning ---
groq_llm = LLM(
    model='groq/llama3-70b-8192',
    api_key=os.environ.get("GROQ_API_KEY")
)

@CrewBase
class TenantPalCrewAutomationForRentersRightsCrew():
    """TenantPalCrewAutomationForRentersRights crew"""

    @agent
    def legal_explainer(self) -> Agent:
        return Agent(
            config=self.agents_config['Legal Explainer'],
            llm=groq_llm,
            verbose=False
        )

    @agent
    def conflict_coach(self) -> Agent:
        return Agent(
            config=self.agents_config['Conflict Coach'],
            llm=groq_llm,
            verbose=False
        )

    @agent
    def urgency_filter(self) -> Agent:
        return Agent(
            config=self.agents_config['Urgency Filter'],
            llm=groq_llm,
            verbose=False
        )

    @agent
    def report_synthesizer(self) -> Agent:
        return Agent(
            config=self.agents_config['Report Synthesizer'],
            llm=groq_llm,
            verbose=False
        )

    @task
    def legal_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['legal_analysis_task'],
            agent=self.legal_explainer()
        )

    @task
    def communication_drafting_task(self) -> Task:
        return Task(
            config=self.tasks_config['communication_drafting_task'],
            agent=self.conflict_coach()
        )

    @task
    def urgency_assessment_task(self) -> Task:
        return Task(
            config=self.tasks_config['urgency_assessment_task'],
            agent=self.urgency_filter()
        )

    @task
    def compile_renter_report_task(self) -> Task:
        return Task(
            config=self.tasks_config['compile_renter_report_task'],
            agent=self.report_synthesizer(),
            context=[
                self.legal_analysis_task(),
                self.communication_drafting_task(),
                self.urgency_assessment_task()
            ]
        )

    @crew
    def crew(self) -> Crew:
        """Creates the TenantPalCrewAutomationForRentersRights crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=False,
        )
