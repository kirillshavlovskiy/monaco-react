/* eslint-disable */
import { rTabs } from 'utils';

const ai_code = {
    pythonScript: `
# To install required packages:
# pip install pyautogen==0.2.9 panel==1.3.8
import autogen
import aioconsole
import panel as pn
import openai
import os
import time
from pathlib import Path
import asyncio
from autogen import config_list_from_dotenv
from autogen.coding import LocalCommandLineCodeExecutor
from autogen.agentchat.contrib.capabilities.teachability import Teachability
work_dir = Path(".")
work_dir.mkdir(exist_ok=True)
executor = LocalCommandLineCodeExecutor(work_dir=work_dir)

code_writer_system_message = """
You have been given coding capability to solve tasks using Python code.
In the following cases, suggest python code (in a python coding block) or shell script (in a sh coding block) for the user to execute.
1. When you need to collect info, use the code to output the info you need...
# extended message content continues here...
"""
    `
};

export default ai_code;