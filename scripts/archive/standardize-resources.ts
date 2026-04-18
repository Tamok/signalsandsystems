import fs from 'fs';
import path from 'path';

// Resource type mapping based on content analysis
const resourceMappings: Record<string, {
  year: number;
  author: string;
  shortTitle: string;
  title: string;
  authors: string[];
  publication: string;
  type: 'research_paper' | 'report' | 'article' | 'survey' | 'whitepaper';
  topics: string[];
  primaryTopic: string;
  tfpRelevance: 'high' | 'medium' | 'low';
  summary: string;
  keyFindings: string[];
  relevanceToTfp: string;
  doi?: string;
  url?: string;
}> = {
  '1-s2.0-S0306452216304018-am_assets': {
    year: 2016,
    author: 'clark',
    shortTitle: 'surfing-uncertainty',
    title: 'Surfing Uncertainty: Prediction, Action, and the Embodied Mind',
    authors: ['Andy Clark'],
    publication: 'Oxford University Press',
    type: 'research_paper',
    topics: ['predictive_processing', 'embodied_cognition', 'neuroscience', 'cognitive_science'],
    primaryTopic: 'predictive_processing',
    tfpRelevance: 'medium',
    summary: 'Explores how the brain actively predicts sensory input and updates models based on prediction errors.',
    keyFindings: [
      'The brain is fundamentally a prediction machine that minimizes surprise',
      'Perception and action are tightly coupled through predictive processing',
      'Cognitive processes emerge from hierarchical prediction and error correction'
    ],
    relevanceToTfp: 'Provides neuroscientific foundation for understanding how cognitive automation affects predictive processing and learning.',
    doi: '10.1093/acprof:oso/9780190217013.001.0001'
  },
  '2024-naep-student-cohorts_assets': {
    year: 2024,
    author: 'naep',
    shortTitle: 'student-achievement-trends',
    title: 'NAEP Student Achievement Trends: 2024 Report on Educational Performance',
    authors: ['National Assessment of Educational Progress'],
    publication: 'U.S. Department of Education',
    type: 'report',
    topics: ['education', 'student_achievement', 'learning_outcomes', 'assessment'],
    primaryTopic: 'education',
    tfpRelevance: 'medium',
    summary: 'Comprehensive analysis of student academic performance trends across multiple years and subjects.',
    keyFindings: [
      'Declining trends in reading and mathematics performance',
      'Widening achievement gaps across demographic groups',
      'Impact of technology integration on learning outcomes'
    ],
    relevanceToTfp: 'Provides educational context for understanding how cognitive automation tools might affect student learning and skill development.'
  },
  '2307.03109v9_assets': {
    year: 2023,
    author: 'chang',
    shortTitle: 'llm-evaluation-survey',
    title: 'A Survey on Evaluation of Large Language Models',
    authors: ['Yupeng Chang', 'Xu Wang', 'Jindong Wang', 'Yuan Wu', 'et al.'],
    publication: 'arXiv preprint',
    type: 'survey',
    topics: ['large_language_models', 'artificial_intelligence', 'evaluation_methods', 'machine_learning'],
    primaryTopic: 'artificial_intelligence',
    tfpRelevance: 'high',
    summary: 'Comprehensive survey of evaluation methods and benchmarks for large language models across various tasks.',
    keyFindings: [
      'LLM evaluation requires multi-dimensional approaches covering capability, safety, and societal impact',
      'Traditional benchmarks may not capture real-world performance adequately',
      'Need for human-centered evaluation frameworks'
    ],
    relevanceToTfp: 'Directly relevant to understanding how LLM capabilities affect human cognitive processes and decision-making.',
    url: 'https://arxiv.org/abs/2307.03109'
  },
  'dong2015_assets': {
    year: 2015,
    author: 'dong',
    shortTitle: 'internet-search-memory',
    title: 'Behavioural and brain responses related to Internet search and memory',
    authors: ['Guangheng Dong', 'Marc N. Potenza'],
    publication: 'European Journal of Neuroscience',
    type: 'research_paper',
    topics: ['internet_search', 'memory', 'neuroscience', 'cognitive_psychology', 'fmri'],
    primaryTopic: 'memory',
    tfpRelevance: 'high',
    summary: 'Neuroimaging study comparing brain responses during Internet-based versus traditional book-based information searching.',
    keyFindings: [
      'Internet searching associated with lower accuracy in recalling information',
      'Different brain activation patterns for internet vs. book searching',
      'Internet searching may promote hasty processing and difficulties in recollection'
    ],
    relevanceToTfp: 'Provides neurological evidence for how search engine use affects memory formation and cognitive processing.',
    doi: '10.1111/ejn.13039'
  },
  'kruger1999_assets': {
    year: 1999,
    author: 'kruger',
    shortTitle: 'dunning-kruger-effect',
    title: 'Unskilled and Unaware of It: How Difficulties in Recognizing One\'s Own Incompetence Lead to Inflated Self-Assessments',
    authors: ['Justin Kruger', 'David Dunning'],
    publication: 'Journal of Personality and Social Psychology',
    type: 'research_paper',
    topics: ['metacognition', 'self_assessment', 'competence', 'cognitive_bias', 'dunning_kruger'],
    primaryTopic: 'metacognition',
    tfpRelevance: 'high',
    summary: 'Seminal study demonstrating that incompetent individuals overestimate their abilities due to metacognitive deficits.',
    keyFindings: [
      'Incompetent people suffer dual burden: poor performance and inability to recognize it',
      'Bottom quartile performers grossly overestimated their abilities',
      'Improving skills enhances metacognitive recognition of limitations'
    ],
    relevanceToTfp: 'Foundational for understanding how cognitive automation might affect metacognitive awareness and skill assessment.',
    doi: '10.1037/0022-3514.77.6.1121'
  },
  'lee_2025_ai_critical_thinking_survey_assets': {
    year: 2025,
    author: 'lee',
    shortTitle: 'ai-critical-thinking-survey',
    title: 'The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects',
    authors: ['Hao-Ping Lee', 'Advait Sarkar', 'Lev Tankelevitch', 'Ian Drosos', 'Sean Rintel', 'Richard Banks', 'Nicholas Wilson'],
    publication: 'CHI Conference on Human Factors in Computing Systems',
    type: 'research_paper',
    topics: ['generative_ai', 'critical_thinking', 'cognitive_effort', 'knowledge_work', 'human_computer_interaction'],
    primaryTopic: 'critical_thinking',
    tfpRelevance: 'high',
    summary: 'Survey of 319 knowledge workers investigating how GenAI affects critical thinking skills and cognitive effort.',
    keyFindings: [
      'Higher confidence in GenAI associated with less critical thinking',
      'GenAI shifts critical thinking toward information verification and response integration',
      'Self-confidence predicts more critical thinking engagement'
    ],
    relevanceToTfp: 'Directly demonstrates TFP concepts through empirical evidence of cognitive effort reduction with AI tools.',
    doi: '10.1145/3706598.3713778'
  },
  'WEF_Future_of_Jobs_2023_assets': {
    year: 2023,
    author: 'wef',
    shortTitle: 'future-jobs-report',
    title: 'The Future of Jobs Report 2023',
    authors: ['World Economic Forum'],
    publication: 'World Economic Forum',
    type: 'report',
    topics: ['future_work', 'automation', 'skills', 'employment', 'artificial_intelligence'],
    primaryTopic: 'future_work',
    tfpRelevance: 'medium',
    summary: 'Comprehensive analysis of how automation and AI will reshape the global job market and required skills.',
    keyFindings: [
      'Rapid transformation of job roles due to AI and automation',
      'Growing importance of human skills like critical thinking and creativity',
      'Need for continuous reskilling and upskilling'
    ],
    relevanceToTfp: 'Provides economic and workforce context for understanding the importance of maintaining cognitive skills in an AI-driven economy.',
    url: 'https://www.weforum.org/reports/the-future-of-jobs-report-2023'
  },
  'brainonllm_assets': {
    year: 2024,
    author: 'kosmyna',
    shortTitle: 'brain-chatgpt-cognitive-debt',
    title: 'Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task',
    authors: ['Nataliya Kosmyna', 'Eugene Hauptmann', 'Ye Tong Yuan', 'Jessica Situ', 'et al.'],
    publication: 'MIT Media Lab',
    type: 'research_paper',
    topics: ['chatgpt', 'cognitive_debt', 'essay_writing', 'neuroscience', 'artificial_intelligence'],
    primaryTopic: 'cognitive_debt',
    tfpRelevance: 'high',
    summary: 'Neuroimaging study examining brain activity patterns when using ChatGPT for essay writing tasks.',
    keyFindings: [
      'Evidence of cognitive debt accumulation when using AI writing assistants',
      'Different brain activation patterns during AI-assisted vs. unassisted writing',
      'Implications for learning and skill development in academic contexts'
    ],
    relevanceToTfp: 'Provides direct neurological evidence supporting TFP concepts of cognitive debt from AI assistance.'
  }
};

// Add more mappings for the remaining resources...
// This is a partial list to demonstrate the structure

const resourcesDir = 'd:\\Coding Shenanigans\\signals-and-systems\\sastro\\src\\content\\tfp\\resources';

function processResources() {
  console.log('Processing TFP resources...');
  
  const entries = fs.readdirSync(resourcesDir, { withFileTypes: true });
  const directories = entries.filter(entry => entry.isDirectory() && entry.name !== '2011-sparrow-google-effects');
  
  for (const dir of directories) {
    const oldName = dir.name;
    console.log(`\\nProcessing: ${oldName}`);
    
    if (resourceMappings[oldName]) {
      const mapping = resourceMappings[oldName];
      const newName = `${mapping.year}-${mapping.author}-${mapping.shortTitle}`;
      
      console.log(`  Renaming to: ${newName}`);
      
      const oldPath = path.join(resourcesDir, oldName);
      const newPath = path.join(resourcesDir, newName);
      
      // Rename directory
      fs.renameSync(oldPath, newPath);
      
      // Find and rename files within the directory
      const files = fs.readdirSync(newPath);
      
      for (const file of files) {
        if (file.endsWith('.pdf') || file.endsWith('.mdx')) {
          const oldFilePath = path.join(newPath, file);
          const extension = path.extname(file);
          const newFileName = `${newName}${extension}`;
          const newFilePath = path.join(newPath, newFileName);
          
          console.log(`    Renaming file: ${file} -> ${newFileName}`);
          fs.renameSync(oldFilePath, newFilePath);
          
          // If it's an MDX file, update its metadata
          if (extension === '.mdx') {
            updateMdxMetadata(newFilePath, mapping);
          }
        }
      }
    } else {
      console.log(`  No mapping found for ${oldName}`);
    }
  }
}

function updateMdxMetadata(filePath: string, mapping: any) {
  console.log(`    Updating MDX metadata: ${path.basename(filePath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Create new frontmatter
    const newFrontmatter = `---
# Core Information
title: "${mapping.title}"
authors: ${JSON.stringify(mapping.authors)}
publication: "${mapping.publication}"
year: ${mapping.year}
type: "${mapping.type}"

# Identification
${mapping.doi ? `doi: "${mapping.doi}"` : ''}
${mapping.url ? `url: "${mapping.url}"` : ''}
original_filename: "${path.basename(filePath).replace('.mdx', '.pdf')}"

# Categorization
topics: ${JSON.stringify(mapping.topics)}
primary_topic: "${mapping.primaryTopic}"
tfp_relevance: "${mapping.tfpRelevance}"

# Content Summary
summary: "${mapping.summary}"
key_findings:
${mapping.keyFindings.map(finding => `  - "${finding}"`).join('\\n')}

# Context for TFP
relevance_to_tfp: "${mapping.relevanceToTfp}"

# Technical Metadata
last_updated: "2025-07-02"
processed_by: "automated_standardization"
quality_score: 3
---`;

    // Find the end of the existing frontmatter
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd === -1) {
      console.log(`    Warning: Could not find frontmatter end in ${filePath}`);
      return;
    }
    
    // Replace frontmatter and keep the rest of the content
    const bodyContent = content.substring(frontmatterEnd + 3);
    const newContent = newFrontmatter + '\\n' + bodyContent;
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`    Successfully updated metadata`);
    
  } catch (error) {
    console.error(`    Error updating ${filePath}:`, error);
  }
}

// Run the processing
processResources();
console.log('\\nResource processing complete!');
