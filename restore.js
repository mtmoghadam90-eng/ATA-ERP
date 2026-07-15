import fs from 'fs';

const jsCode = fs.readFileSync('projectsview_devserver.js', 'utf8');
const lines = jsCode.split('\n');

let targetIndex = -1;
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('const projectDeliveries = (packagingDeliveries || []).filter((del) => del.projectId === p.id);')) {
    targetIndex = i;
    break;
  }
}

if (targetIndex === -1) {
  console.log("Could not find insertion point");
  process.exit(1);
}

const jsHeader = lines.slice(0, targetIndex).join('\n');

// Clean up imports
let tsHeader = `
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus, Search, Filter, Briefcase, Edit, Trash2, XCircle, AlertCircle, TrendingUp, X,
  FileSpreadsheet, Clock, Sliders, User, Paperclip, ChevronLeft, ChevronDown, ChevronUp,
  Send, CheckCircle2, History, Check, Folder, FolderOpen, File, Download, Eye, Upload,
  ChevronRight, Loader2, Image as ImageIcon, Maximize2, Minimize2
} from 'lucide-react';

import { getTodayShamsi, addDaysToShamsi, addWorkingDaysToShamsi } from '../dateUtils';
import { getProformaOutcomeStatus } from '../useERPStore';
import ShamsiDatePicker from './ShamsiDatePicker';
import CustomFieldsForm from './CustomFieldsForm';
import { uploadFile, compressImage } from '../imageUtils';
import CustomFieldsDetailView from './CustomFieldsDetailView';
import { exportToCSV } from '../excelUtils';
import ConfirmModal from './ConfirmModal';
import QuickAddModal from './QuickAddModal';
import { SearchableSelect } from './SearchableSelect';
import { Project, Customer, Product, Proforma, ERPSettings, ProjectCategoryGroup, User as UserType, Transaction, PackagingDelivery, PurchaseOrder, AfterSalesService } from '../types';

export interface ProjectsViewProps {
  onOpenDocument?: (doc: any) => void;
  projects: Project[];
  customers: Customer[];
  products: Product[];
  proformas: Proforma[];
  packagingDeliveries?: PackagingDelivery[];
  transactions?: Transaction[];
  purchaseOrders?: PurchaseOrder[];
  afterSalesServices?: AfterSalesService[];
  addProject: (p: any) => any;
  updateProject: (p: any) => void;
  deleteProject: (id: string, deleteLogs: boolean) => void;
  settings: ERPSettings;
  addCustomer: (c: any) => any;
  addProduct: (p: any) => any;
  projectCategoryGroups?: ProjectCategoryGroup[];
  addProjectCategoryGroup: (g: any) => void;
  addProjectActivity: (projectId: string, categoryId: string, activity: any) => void;
  completeProjectCategoryGroup: (projectId: string, categoryId: string, logs?: any) => void;
  resumeProjectCategoryGroup: (projectId: string, categoryId: string, logs?: any) => void;
  deleteProjectCategoryGroup: (projectId: string, categoryId: string, logs?: any) => void;
  updateProjectActivity: (projectId: string, categoryId: string, activityId: string, newAct: any) => void;
  deleteProjectActivity: (projectId: string, categoryId: string, activityId: string) => void;
  currentUser: UserType | null;
  users?: UserType[];
  initialSelectedProjectId?: string | null;
  onClearInitialSelectedProject?: () => void;
}

export default function ProjectsView({
  onOpenDocument, projects, customers, products, proformas,
  packagingDeliveries = [], transactions = [], purchaseOrders = [], afterSalesServices = [],
  addProject, updateProject, deleteProject, settings, addCustomer, addProduct,
  projectCategoryGroups = [], addProjectCategoryGroup, addProjectActivity,
  completeProjectCategoryGroup, resumeProjectCategoryGroup, deleteProjectCategoryGroup,
  updateProjectActivity, deleteProjectActivity, currentUser, users = [],
  initialSelectedProjectId, onClearInitialSelectedProject
}: ProjectsViewProps) {
`;

// Now extract the body of the function from JS code.
const fnBodyStart = lines.findIndex(l => l.includes('function ProjectsView('));
let bodyLines = lines.slice(fnBodyStart);
// find where '{' is
const firstBrace = bodyLines.findIndex(l => l.includes('{'));
bodyLines = bodyLines.slice(firstBrace + 1, targetIndex - fnBodyStart); // up to targetIndex

// Replace state initializations that have `{}` to typed versions, if needed.
// Actually, since this is TSX, any untyped state will be inferred as `any`.
// That might cause TS errors. Let's just use `any` for everything.
let bodyText = bodyLines.join('\n');
bodyText = bodyText.replace(/useState\(\{([^}]+)?\}\)/g, 'useState<any>({$1})');
bodyText = bodyText.replace(/useState\(\[\]\)/g, 'useState<any[]>([])');
bodyText = bodyText.replace(/useState\(null\)/g, 'useState<any>(null)');

tsHeader += bodyText + '\n';

const restOfTsx = fs.readFileSync('current_projects_view.txt', 'utf8');
const finalTsx = tsHeader + restOfTsx;

fs.writeFileSync('src/components/ProjectsView.tsx', finalTsx);
console.log("Restored ProjectsView.tsx");
