from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task


@CrewBase
class TenantPalCrewAutomationForRentersRightsCrew():
    """TenantPalCrewAutomationForRentersRights crew"""

    @agent
    def Legal Explainer(self) -> Agent:
        return Agent(
            config=self.agents_config['Legal Explainer'],
            tools=[],
        )

    @agent
    def Conflict Coach(self) -> Agent:
        return Agent(
            config=self.agents_config['Conflict Coach'],
            tools=[],
        )

    @agent
    def Urgency Filter(self) -> Agent:
        return Agent(
            config=self.agents_config['Urgency Filter'],
            tools=[],
        )


    @task
    def legal_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['legal_analysis_task'],
            tools=[],
        )

    @task
    def communication_drafting_task(self) -> Task:
        return Task(
            config=self.tasks_config['communication_drafting_task'],
            tools=[],
        )

    @task
    def urgency_assessment_task(self) -> Task:
        return Task(
            config=self.tasks_config['urgency_assessment_task'],
            tools=[],
        )


    @crew
    def crew(self) -> Crew:
        """Creates the TenantPalCrewAutomationForRentersRights crew"""
        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )
