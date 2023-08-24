import type { Meta, StoryObj } from '@storybook/react';
import React from "react";
import {AppWithRedux} from "../AppWithRedux";
import {ReduxStoreProviderDecorator} from "./decoraties/ReduxStoreProviderDecorator";


const meta: Meta<typeof AppWithRedux> = {
  title: 'TODOLISTS/AppWithRedux',
  component: AppWithRedux,

  tags: ['autodocs'],
  decorators: [ReduxStoreProviderDecorator]

} satisfies Meta<typeof AppWithRedux>;

export default meta;
type Story = StoryObj<typeof AppWithRedux>;

export const AddItemFormStory: Story = {
  render: () => <AppWithRedux />
};


