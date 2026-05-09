import { z } from 'zod';

export const CAESoftwareSchema = z.enum(['ansa', 'hyperworks', 'abaqus', 'nastran', 'lsdyna', 'custom']);
export type CAESoftware = z.infer<typeof CAESoftwareSchema>;

export const APIFunctionSchema = z.object({
  name: z.string(),
  name_zh: z.string(),
  description: z.string(),
  module: z.string(),
  signature: z.string(),
  parameters: z.array(z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean(),
    default: z.any().optional(),
    description: z.string().optional()
  })),
  returns: z.string().optional(),
  example: z.string().optional(),
  category: z.string()
});
export type APIFunction = z.infer<typeof APIFunctionSchema>;

export interface ScriptContext {
  software: CAESoftware;
  task: string;
  parameters: Record<string, any>;
  working_dir?: string;
}

export interface GenerationResult {
  success: boolean;
  code: string;
  imports: string[];
  functions_used: string[];
  explanation: string;
  warnings?: string[];
}

export class CAEKnowledgeBase {
  private apiDatabase: Map<CAESoftware, APIFunction[]> = new Map();
  private snippets: Map<string, string> = new Map();

  constructor() {
    this.initANSAApi();
    this.initHyperWorksApi();
    this.initAbaqusApi();
    this.initSnippets();
  }

  private initANSAApi(): void {
    const ansaApis: APIFunction[] = [
      {
        name: 'ansa.geometry.create_surface',
        name_zh: '创建曲面',
        description: 'Create a new surface in ANSA',
        module: 'ansa.geometry',
        signature: 'create_surface(name, points=None, surface_type="NURB")',
        parameters: [
          { name: 'name', type: 'str', required: true, description: 'Surface name' },
          { name: 'points', type: 'list', required: false, description: 'Control points' },
          { name: 'surface_type', type: 'str', required: false, default: 'NURB', description: 'Surface type' }
        ],
        returns: 'Surface object',
        example: `importansa()
from ansa import geometry
surf = geometry.create_surface("MySurface")`,
        category: 'geometry'
      },
      {
        name: 'ansa.mesh.generate_mesh',
        name_zh: '生成网格',
        description: 'Generate mesh on selected entities',
        module: 'ansa.mesh',
        signature: 'generate_mesh(entities, element_type, mesh_size)',
        parameters: [
          { name: 'entities', type: 'list', required: true, description: 'Entities to mesh' },
          { name: 'element_type', type: 'str', required: true, description: 'Element type (QUAD4, TRIA3, etc.)' },
          { name: 'mesh_size', type: 'float', required: true, description: 'Target mesh size' }
        ],
        returns: 'List of created elements',
        example: `from ansa import mesh
elements = mesh.generate_mesh(surfaces, "QUAD4", 2.0)`,
        category: 'mesh'
      },
      {
        name: 'ansa.boundary_conditions.set_constraint',
        name_zh: '设置约束',
        description: 'Apply boundary conditions to entities',
        module: 'ansa.boundary_conditions',
        signature: 'set_constraint(entities, dofs, values)',
        parameters: [
          { name: 'entities', type: 'list', required: true, description: 'Target entities' },
          { name: 'dofs', type: 'dict', required: true, description: 'Degrees of freedom' },
          { name: 'values', type: 'dict', required: true, description: 'Constraint values' }
        ],
        returns: 'Constraint object',
        example: `from ansa import boundary_conditions
bc = boundary_conditions.set_constraint(nodes, {"TX": 0, "TY": 0, "TZ": 0})`,
        category: 'boundary_conditions'
      },
      {
        name: 'ansa.material.create_material',
        name_zh: '创建材料',
        description: 'Create a new material',
        module: 'ansa.material',
        signature: 'create_material(name, material_type, properties)',
        parameters: [
          { name: 'name', type: 'str', required: true, description: 'Material name' },
          { name: 'material_type', type: 'str', required: true, description: 'Material type (ISO, ORTHO, etc.)' },
          { name: 'properties', type: 'dict', required: true, description: 'Material properties' }
        ],
        returns: 'Material object',
        example: `from ansa import material
mat = material.create_material("Steel", "ISO", {"E": 210000, "NU": 0.3})`,
        category: 'material'
      },
      {
        name: 'ansa.property.assign_property',
        name_zh: '分配属性',
        description: 'Assign property to elements',
        module: 'ansa.property',
        signature: 'assign_property(elements, property)',
        parameters: [
          { name: 'elements', type: 'list', required: true, description: 'Target elements' },
          { name: 'property', type: 'Property', required: true, description: 'Property to assign' }
        ],
        returns: 'void',
        example: `from ansa import property
property.assign_property(elements, shell_prop)`,
        category: 'property'
      },
      {
        name: 'ansa.results.read_results',
        name_zh: '读取结果',
        description: 'Read results from result file',
        module: 'ansa.results',
        signature: 'read_results(filepath, result_type)',
        parameters: [
          { name: 'filepath', type: 'str', required: true, description: 'Result file path' },
          { name: 'result_type', type: 'str', required: true, description: 'Result type' }
        ],
        returns: 'Results object',
        example: `from ansa import results
res = results.read_results("output.rst", "displacement")`,
        category: 'results'
      }
    ];
    this.apiDatabase.set('ansa', ansaApis);
  }

  private initHyperWorksApi(): void {
    const hwApis: APIFunction[] = [
      {
        name: 'hm.modules.create_module',
        name_zh: '创建模块',
        description: 'Create a new HyperMesh module',
        module: 'hm.modules',
        signature: 'create_module(name)',
        parameters: [
          { name: 'name', type: 'str', required: true, description: 'Module name' }
        ],
        returns: 'Module ID',
        example: `import hyparm as hm
module_id = hm.modules.create_module("Analysis")`,
        category: 'modules'
      },
      {
        name: 'hm.mesh.create_nodes',
        name_zh: '创建节点',
        description: 'Create nodes at specified coordinates',
        module: 'hm.mesh',
        signature: 'create_nodes(coordinates)',
        parameters: [
          { name: 'coordinates', type: 'list', required: true, description: 'List of [x,y,z] coordinates' }
        ],
        returns: 'List of node IDs',
        example: `nodes = hm.mesh.create_nodes([[0,0,0], [1,0,0], [0,1,0]])`,
        category: 'mesh'
      },
      {
        name: 'hm.bc.create_load',
        name_zh: '创建载荷',
        description: 'Create boundary condition load',
        module: 'hm.bc',
        signature: 'create_load(entities, load_type, values)',
        parameters: [
          { name: 'entities', type: 'list', required: true, description: 'Target entities' },
          { name: 'load_type', type: 'str', required: true, description: 'Load type (FORCE, MOMENT, etc.)' },
          { name: 'values', type: 'dict', required: true, description: 'Load values' }
        ],
        returns: 'Load ID',
        example: `load_id = hm.bc.create_load(components, "FORCE", {"x": 1000, "y": 0, "z": 0})`,
        category: 'boundary_conditions'
      },
      {
        name: 'hm.solver.write_input',
        name_zh: '写入求解器输入',
        description: 'Write solver input file',
        module: 'hm.solver',
        signature: 'write_input(filepath, solver)',
        parameters: [
          { name: 'filepath', type: 'str', required: true, description: 'Output file path' },
          { name: 'solver', type: 'str', required: true, description: 'Solver type' }
        ],
        returns: 'bool',
        example: `hm.solver.write_input("model.bul", "optistruct")`,
        category: 'solver'
      }
    ];
    this.apiDatabase.set('hyperworks', hwApis);
  }

  private initAbaqusApi(): void {
    const abaqusApis: APIFunction[] = [
      {
        name: 'mdb.models.changeKey',
        name_zh: '重命名模型',
        description: 'Change the key/name of a model',
        module: 'mdb',
        signature: 'mdb.models.changeKey(fromName, toName)',
        parameters: [
          { name: 'fromName', type: 'str', required: true, description: 'Current model name' },
          { name: 'toName', type: 'str', required: true, description: 'New model name' }
        ],
        returns: 'void',
        example: `mdb.models.changeKey('Model-1', 'BeamModel')`,
        category: 'model'
      },
      {
        name: 'mdb.models[name].parts',
        name_zh: '创建部件',
        description: 'Create a new part',
        module: 'Part',
        signature: 'mdb.models[name].Part(name, dimensionality, type)',
        parameters: [
          { name: 'name', type: 'str', required: true, description: 'Part name' },
          { name: 'dimensionality', type: 'str', required: true, description: 'Dimensionality' },
          { name: 'type', type: 'str', required: false, description: 'Part type' }
        ],
        returns: 'Part object',
        example: `p = mdb.models['Model-1'].Part(name='Beam', dimensionality=THREE_D, type=DEFORMABLE_BODY)`,
        category: 'geometry'
      },
      {
        name: 'mdb.models[name].materials',
        name_zh: '创建材料',
        description: 'Create a new material',
        module: 'Material',
        signature: 'mdb.models[name].Material(name)',
        parameters: [
          { name: 'name', type: 'str', required: true, description: 'Material name' }
        ],
        returns: 'Material object',
        example: `steel = mdb.models['Model-1'].Material(name='Steel')\nsteel.Elastic(table=((210000, 0.3), ))`,
        category: 'material'
      },
      {
        name: 'mdb.models[name].steps',
        name_zh: '创建分析步',
        description: 'Create an analysis step',
        module: 'Step',
        signature: 'mdb.models[name].StaticStep(name, previous, timePeriod, maxNumInc)',
        parameters: [
          { name: 'name', type: 'str', required: true, description: 'Step name' },
          { name: 'previous', type: 'str', required: false, description: 'Previous step name' },
          { name: 'timePeriod', type: 'float', required: false, description: 'Step time period' },
          { name: 'maxNumInc', type: 'int', required: false, description: 'Maximum increments' }
        ],
        returns: 'Step object',
        example: `mdb.models['Model-1'].StaticStep(name='LoadStep', previous='Initial', timePeriod=1.0)`,
        category: 'step'
      },
      {
        name: 'mdb.models[name].Assembly',
        name_zh: '创建装配',
        description: 'Create or access assembly',
        module: 'Assembly',
        signature: 'mdb.models[name].rootAssembly',
        parameters: [],
        returns: 'Assembly object',
        example: `asm = mdb.models['Model-1'].rootAssembly\nasm.Instance(name='Beam-1', part=p, dependent=ON)`,
        category: 'assembly'
      },
      {
        name: 'session.journalOptions',
        name_zh: '回读结果',
        description: 'Read results from output database',
        module: 'odbAccess',
        signature: 'openOdb(path)',
        parameters: [
          { name: 'path', type: 'str', required: true, description: 'ODB file path' }
        ],
        returns: 'Odb object',
        example: `from odbAccess import openOdb\nodb = openOdb('job.odb')\nstep = odb.steps['Step-1']`,
        category: 'results'
      }
    ];
    this.apiDatabase.set('abaqus', abaqusApis);
  }

  private initSnippets(): void {
    this.snippets.set('mesh_cube', `# Generate mesh on cube surface
importansa()
from ansa import mesh, geometry

# Create cube geometry
points = [
    (0, 0, 0), (10, 0, 0), (10, 10, 0), (0, 10, 0),
    (0, 0, 10), (10, 0, 10), (10, 10, 10), (0, 10, 10)
]
cube = geometry.create_surface("Cube")

# Generate mesh
elements = mesh.generate_mesh(cube, "QUAD4", 2.0)
print(f"Generated {len(elements)} elements")`);

    this.snippets.set('apply_bc_clamped', `# Apply clamped boundary condition
from ansa import boundary_conditions

# Fix all DOFs at the selected nodes
bc = boundary_conditions.set_constraint(
    nodes, 
    {"TX": 0, "TY": 0, "TZ": 0, "RX": 0, "RY": 0, "RZ": 0}
)
print("Clamped BC applied")`);

    this.snippets.set('abaqus_contact', `# Define contact in Abaqus
from abaqus import *
from abaqusConstants import *

model = mdb.models['Model-1']

# Create contact property
contact_prop = model.ContactProperty('ContactProperty-1')
contact_prop.TangentialBehavior(formulation=FRICTIONLESS)
contact_prop.NormalBehavior(pressureOverclosure=EXPONENTIAL)

# Assign to surface pair
model.interactions['Int-1'].contactPropertyes = (contact_prop, )`);

    this.snippets.set('optistruct_optimization', `# HyperWorks topology optimization
import hyparm as hm

# Create design space
hm.collectors.create('ds', 'DESVAR', {'type': 'TOPO', 'domain': component})

# Create response
hm.params.create('volume', 'DRESP1', {'type': 'VOLUME'})
hm.params.create('stress', 'DRESP1', {'type': 'STRESS', 'label': 'STRESS'})

# Create objective
hm.objectives.minimize('volume', 'STRESS')
hm.objectives.add('mass', 'TARGET', value=0.3)`);
  }

  getAPIs(software: CAESoftware): APIFunction[] {
    return this.apiDatabase.get(software) || [];
  }

  searchAPIs(software: CAESoftware, query: string): APIFunction[] {
    const apis = this.getAPIs(software);
    const q = query.toLowerCase();
    return apis.filter(api => 
      api.name.toLowerCase().includes(q) ||
      api.name_zh.includes(q) ||
      api.description.toLowerCase().includes(q) ||
      api.category.toLowerCase().includes(q)
    );
  }

  getAPIsByCategory(software: CAESoftware, category: string): APIFunction[] {
    return this.getAPIs(software).filter(api => api.category === category);
  }

  getSnippet(name: string): string | undefined {
    return this.snippets.get(name);
  }

  listSnippets(): string[] {
    return Array.from(this.snippets.keys());
  }
}

export class CAEScriptTool {
  private knowledgeBase: CAEKnowledgeBase;
  private executionHistory: Map<string, any[]> = new Map();

  constructor() {
    this.knowledgeBase = new CAEKnowledgeBase();
  }

  async generateScript(context: ScriptContext): Promise<GenerationResult> {
    const { software, task, parameters } = context;
    const apis = this.knowledgeBase.getAPIs(software);
    
    const relevantAPIs = this.selectRelevantAPIs(software, task, apis);
    const code = this.buildScript(software, task, parameters, relevantAPIs);
    
    return {
      success: true,
      code,
      imports: this.getImports(software),
      functions_used: relevantAPIs.map(a => a.name),
      explanation: this.generateExplanation(software, task, relevantAPIs),
      warnings: this.validateCode(code, software)
    };
  }

  private selectRelevantAPIs(_software: CAESoftware, task: string, apis: APIFunction[]): APIFunction[] {
    const taskLower = task.toLowerCase();
    const relevant: APIFunction[] = [];

    const categoryMap: Record<string, string[]> = {
      'mesh': ['mesh', 'geometry'],
      'grid': ['mesh', 'geometry'],
      '网格': ['mesh', 'geometry'],
      'boundary': ['boundary_conditions', 'bc'],
      'constraint': ['boundary_conditions', 'bc'],
      '约束': ['boundary_conditions', 'bc'],
      'boundary_conditions': ['boundary_conditions', 'bc'],
      'load': ['boundary_conditions', 'bc'],
      '载荷': ['boundary_conditions', 'bc'],
      'material': ['material'],
      '材料': ['material'],
      'property': ['property'],
      '属性': ['property'],
      'result': ['results'],
      '结果': ['results'],
      'optimization': ['optimization'],
      '优化': ['optimization']
    };

    for (const [keyword, categories] of Object.entries(categoryMap)) {
      if (taskLower.includes(keyword)) {
        const matched = apis.filter(api => categories.some(cat => api.category.includes(cat)));
        matched.forEach(api => {
          if (!relevant.includes(api)) relevant.push(api);
        });
      }
    }

    if (relevant.length === 0) {
      return apis.slice(0, 5);
    }

    return relevant;
  }

  private buildScript(
    software: CAESoftware, 
    task: string, 
    parameters: Record<string, any>,
    apis: APIFunction[]
  ): string {
    const lines: string[] = [];

    lines.push(...this.getImports(software));
    lines.push('');

    switch (software) {
      case 'ansa':
        lines.push(...this.buildANSAScript(task, parameters, apis));
        break;
      case 'hyperworks':
        lines.push(...this.buildHyperWorksScript(task, parameters, apis));
        break;
      case 'abaqus':
        lines.push(...this.buildAbaqusScript(task, parameters, apis));
        break;
      default:
        lines.push(`# Generated script for ${software}`);
        lines.push(`# Task: ${task}`);
        lines.push('');
        for (const api of apis) {
          if (api.example) {
            lines.push(`# ${api.example}`);
          }
        }
    }

    return lines.join('\n');
  }

  private buildANSAScript(task: string, parameters: any, apis: APIFunction[]): string[] {
    const lines: string[] = [
      'importansa()',
      'from ansa import geometry, mesh, boundary_conditions, material, property',
      '',
      '# Generated by CAE Claw',
      `# Task: ${task}`,
      ''
    ];

    const taskLower = task.toLowerCase();

    if (taskLower.includes('mesh') || taskLower.includes('网格')) {
      lines.push('# Generate mesh');
      lines.push('mesh_size = ' + (parameters.mesh_size || 2.0));
      lines.push('element_type = "' + (parameters.element_type || 'QUAD4') + '"');
      lines.push('');
      const meshApi = apis.find(a => a.category === 'mesh');
      if (meshApi?.example) {
        lines.push(meshApi.example.split('\n').slice(-2).join('\n'));
      }
    }

    if (taskLower.includes('boundary') || taskLower.includes('constraint') || taskLower.includes('约束')) {
      lines.push('# Apply boundary conditions');
      lines.push('# Select nodes at fixed face');
      lines.push('fixed_nodes = deck.get_entities(L_ATT, "FixedFace")');
      lines.push('');
      const bcApi = apis.find(a => a.category === 'boundary_conditions');
      if (bcApi?.example) {
        lines.push(bcApi.example);
      }
    }

    if (taskLower.includes('material') || taskLower.includes('材料')) {
      lines.push('# Create material');
      lines.push('material_name = "' + (parameters.material_name || 'Steel') + '"');
      lines.push('material_props = ' + JSON.stringify(parameters.material_props || { 'E': 210000, 'NU': 0.3 }));
      lines.push('');
      const matApi = apis.find(a => a.category === 'material');
      if (matApi?.example) {
        lines.push(matApi.example);
      }
    }

    return lines;
  }

  private buildHyperWorksScript(task: string, _parameters: any, apis: APIFunction[]): string[] {
    const lines: string[] = [
      'import hyparm as hm',
      '',
      '# Generated by CAE Claw',
      `# Task: ${task}`,
      ''
    ];

    const taskLower = task.toLowerCase();

    if (taskLower.includes('mesh') || taskLower.includes('网格')) {
      lines.push('# Create mesh');
      lines.push('nodes = hm.mesh.create_nodes([[0, 0, 0], [1, 0, 0]])');
      lines.push('');
      const meshApi = apis.find(a => a.category === 'mesh');
      if (meshApi?.example) {
        lines.push(meshApi.example);
      }
    }

    if (taskLower.includes('load') || taskLower.includes('载荷')) {
      lines.push('# Apply load');
      const loadApi = apis.find(a => a.category === 'boundary_conditions');
      if (loadApi?.example) {
        lines.push(loadApi.example);
      }
    }

    return lines;
  }

  private buildAbaqusScript(task: string, parameters: any, apis: APIFunction[]): string[] {
    const lines: string[] = [
      'from abaqus import *',
      'from abaqusConstants import *',
      '',
      '# Generated by CAE Claw',
      `# Task: ${task}`,
      '',
      '# Model name',
      "model_name = '" + (parameters.model_name || 'Model-1') + "'",
      ''
    ];

    const taskLower = task.toLowerCase();

    if (taskLower.includes('part') || taskLower.includes('几何')) {
      lines.push('# Create part');
      lines.push("part = mdb.models[model_name].Part(");
      lines.push("    name='Part-1',");
      lines.push("    dimensionality=THREE_D,");
      lines.push("    type=DEFORMABLE_BODY)");
      lines.push('');
    }

    if (taskLower.includes('material') || taskLower.includes('材料')) {
      lines.push('# Create material');
      lines.push("mat = mdb.models[model_name].Material(name='Steel')");
      lines.push("mat.Elastic(table=((210000.0, 0.3), ))");
      lines.push('');
    }

    if (taskLower.includes('step') || taskLower.includes('分析步')) {
      lines.push('# Create step');
      lines.push("mdb.models[model_name].StaticStep(");
      lines.push("    name='LoadStep',");
      lines.push("    previous='Initial',");
      lines.push("    timePeriod=1.0)");
      lines.push('');
    }

    if (taskLower.includes('assembly') || taskLower.includes('装配')) {
      const asmApi = apis.find(a => a.category === 'assembly');
      if (asmApi?.example) {
        lines.push('# Create assembly');
        lines.push(asmApi.example);
      }
    }

    if (taskLower.includes('result') || taskLower.includes('结果')) {
      lines.push('# Read results');
      lines.push("from odbAccess import openOdb");
      lines.push("odb = openOdb('job.odb')");
      lines.push("step = odb.steps['Step-1']");
      lines.push('');
    }

    return lines;
  }

  private getImports(software: CAESoftware): string[] {
    switch (software) {
      case 'ansa':
        return ['importansa()', 'from ansa import *'];
      case 'hyperworks':
        return ['import hyparm as hm'];
      case 'abaqus':
        return ['from abaqus import *', 'from abaqusConstants import *'];
      default:
        return ['# Import required modules'];
    }
  }

  private generateExplanation(software: CAESoftware, task: string, apis: APIFunction[]): string {
    const softwareNames: Record<CAESoftware, string> = {
      'ansa': 'ANSA',
      'hyperworks': 'HyperWorks',
      'abaqus': 'Abaqus',
      'nastran': 'Nastran',
      'lsdyna': 'LS-DYNA',
      'custom': 'Custom CAE'
    };

    const apiNames = apis.map(a => a.name.split('.')[1]).join(', ');
    
    return `This script was generated for ${softwareNames[software]} to accomplish: "${task}". ` +
           `It uses the following APIs: ${apiNames}. ` +
           `Review the generated code and adjust parameters as needed for your specific model.`;
  }

  private validateCode(code: string, software: CAESoftware): string[] {
    const warnings: string[] = [];
    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length > 120 && !line.startsWith('#')) {
        warnings.push(`Line ${i + 1}: Line too long (${line.length} > 120 characters)`);
      }
    }

    if (software === 'ansa' && !code.includes('importansa')) {
      warnings.push('ANSA script should start with importansa()');
    }

    return warnings;
  }

  async getAutocomplete(software: CAESoftware, prefix: string): Promise<APIFunction[]> {
    return this.knowledgeBase.searchAPIs(software, prefix);
  }

  getKnowledgeBase(): CAEKnowledgeBase {
    return this.knowledgeBase;
  }

  async execute(code: string, context: { software: CAESoftware; timeout?: number }): Promise<{
    success: boolean;
    stdout: string;
    stderr: string;
    elapsed_ms: number;
  }> {
    const startTime = Date.now();
    
    const executionId = `exec_${Date.now()}`;
    if (!this.executionHistory.has(context.software)) {
      this.executionHistory.set(context.software, []);
    }
    this.executionHistory.get(context.software)!.push({
      id: executionId,
      code,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      stdout: `[Mock] Executed ${context.software} script\nCode length: ${code.length} characters`,
      stderr: '',
      elapsed_ms: Date.now() - startTime
    };
  }

  getExecutionHistory(software?: CAESoftware): any[] {
    if (software) {
      return this.executionHistory.get(software) || [];
    }
    return Array.from(this.executionHistory.values()).flat();
  }
}
