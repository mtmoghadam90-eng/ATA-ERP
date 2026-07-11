with open('src/components/ProjectsView.tsx', 'r') as f:
    content = f.read()

sync_effect = """  const [selectedProjectForActivities, setSelectedProjectForActivities] = useState<Project | null>(null);

  React.useEffect(() => {
    if (selectedProjectForActivities) {
      const updatedProject = projects.find(p => p.id === selectedProjectForActivities.id);
      if (updatedProject && updatedProject !== selectedProjectForActivities) {
        setSelectedProjectForActivities(updatedProject);
      }
    }
  }, [projects, selectedProjectForActivities]);"""

content = content.replace("  const [selectedProjectForActivities, setSelectedProjectForActivities] = useState<Project | null>(null);", sync_effect)

with open('src/components/ProjectsView.tsx', 'w') as f:
    f.write(content)
