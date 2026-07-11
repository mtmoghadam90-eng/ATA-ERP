with open('src/App.tsx', 'r') as f:
    content = f.read()

modal_render = """
      {/* Category Completion Prompt Modal */}
      <ConfirmModal
        isOpen={!!store.completionPrompt}
        onClose={() => store.setCompletionPrompt(null)}
        onConfirm={() => {
          if (store.completionPrompt) {
            store.completeCategoryGroup(store.completionPrompt.projectId, store.completionPrompt.categoryName);
            store.setCompletionPrompt(null);
          }
        }}
        title="اتمام کار فعالیت"
        message={store.completionPrompt?.message || ''}
      />
"""

content = content.replace("      {/* Search Modal */}", modal_render + "\n      {/* Search Modal */}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
