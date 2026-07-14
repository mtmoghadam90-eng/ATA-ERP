import fs from 'fs';

let content = fs.readFileSync('src/components/ProjectsView.tsx', 'utf-8');

const regex = /\{\/\* Toggle Button \*\/\}\s*\{canManageCompletion && \(isGroupClosed \? \(/;
const index = content.search(regex);
if (index === -1) {
  console.log('Not found!');
  process.exit(1);
}

const replacement = `
                                  {/* Delete Category Group Button (only for non-system) */}
                                  {!group.categoryId.startsWith('cat-fact-') && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm('آیا از حذف این دسته فعالیت و تمام سوابق آن اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
                                          if (deleteProjectCategoryGroup) {
                                            deleteProjectCategoryGroup(group.id);
                                          }
                                        }
                                      }}
                                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded transition border border-rose-100 flex items-center gap-1 shadow-sm ml-1"
                                      title="حذف دسته"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  )}
                                  
                                  {/* Toggle Button */}
                                  {canManageCompletion && (isGroupClosed ? (
`;

content = content.replace(regex, replacement.trim());
fs.writeFileSync('src/components/ProjectsView.tsx', content);
console.log('Fixed ProjectsView buttons');
