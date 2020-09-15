require 'rails_helper'

RSpec.describe Mutations::UpdateTask do
  let(:task) do
    create(
      :task,
      {
        description: nil,
        name: nil,
        stage: 'Not Assigned',
        due_date: nil,
        estimate: nil
      }
    )
  end

  let(:input) do
    <<-GRAPHQL
    {
      id: "#{task.uid}",
      name: "Updated Name",
    }
    GRAPHQL
  end

  let(:query) do
    <<-GRAPHQL
    mutation {
      updateTask(input: #{input}) {
        task {
          id
          stage
          name
        }
        errors {
          code
        }
      }
    }
    GRAPHQL
  end

  let(:context) { { current_user: task.application.project.user } }

  before :each do
    allow_any_instance_of(Task).to receive(:sync_to_airtable)
  end

  context 'when the user does not have access to the project' do
    it 'returns an error' do
      response =
        AdvisableSchema.execute(query, context: { current_user: create(:user) })
      error = response['data']['updateTask']['errors'][0]
      expect(error['code']).to eq('not_authorized')
    end
  end

  context 'when there is no authenticated user' do
    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: { current_user: nil })
      error = response['data']['updateTask']['errors'][0]
      expect(error['code']).to eq('not_authorized')
    end
  end

  context 'when the stage is Assigned' do
    let(:task) { create(:task, stage: 'Assigned') }

    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: context)
      error = response['data']['updateTask']['errors'][0]
      expect(error['code']).to eq('tasks.nameIsLocked')
    end
  end

  context 'when the stage is Working' do
    let(:task) { create(:task, stage: 'Working') }

    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: context)
      error = response['data']['updateTask']['errors'][0]
      expect(error['code']).to eq('tasks.nameIsLocked')
    end
  end

  context 'when the stage is Submitted' do
    let(:task) { create(:task, stage: 'Submitted') }

    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: context)
      error = response['data']['updateTask']['errors'][0]
      expect(error['code']).to eq('tasks.nameIsLocked')
    end
  end

  context 'when the stage is Approved' do
    let(:task) { create(:task, stage: 'Approved') }

    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: context)
      error = response['data']['updateTask']['errors'][0]
      expect(error['code']).to eq('tasks.nameIsLocked')
    end
  end

  context 'when updating the name' do
    let(:input) do
      <<-GRAPHQL
      {
        id: "#{task.uid}",
        name: "Updated Name",
      }
      GRAPHQL
    end

    it 'updates the task name' do
      response = AdvisableSchema.execute(query, context: context)
      name = response['data']['updateTask']['task']['name']
      expect(name).to eq('Updated Name')
    end

    it 'doesnt trigger a webhook' do
      expect(WebhookEvent).to_not receive(:trigger)
      AdvisableSchema.execute(query, context: context)
    end

    context 'and the stage is Assigned' do
      let(:task) { create(:task, name: nil, stage: 'Assigned') }

      it 'returns an error' do
        response = AdvisableSchema.execute(query, context: context)
        error = response['data']['updateTask']['errors'][0]
        expect(error['code']).to eq('tasks.nameIsLocked')
      end
    end

    context 'and the stage is Quote Provided' do
      let(:task) { create(:task, name: nil, stage: 'Quote Provided') }

      it 'sets the stage to Not Assigned' do
        expect { AdvisableSchema.execute(query, context: context) }.to change {
          task.reload.stage
        }.from('Quote Provided').to('Not Assigned')
      end
    end

    context 'and the task has an estimate' do
      let(:task) do
        create(:task, name: nil, stage: 'Not Assigned', estimate: 8)
      end

      context 'and the user is the client' do
        let(:context) { { current_user: task.application.project.user } }

        it 'removes the estimate' do
          expect {
            AdvisableSchema.execute(query, context: context)
          }.to change { task.reload.estimate }.from(8).to(nil)
        end
      end

      context 'and the user is the specialist' do
        let(:context) { { current_user: task.application.specialist } }

        it 'does not removes the estimate' do
          expect {
            AdvisableSchema.execute(query, context: context)
          }.to_not change { task.reload.estimate }
        end
      end
    end
  end

  context 'when updating the description' do
    let(:input) do
      <<-GRAPHQL
      {
        id: "#{task.uid}",
        description: "Updated description",
      }
      GRAPHQL
    end

    it 'Updates the task description' do
      expect { AdvisableSchema.execute(query, context: context) }.to change {
        task.reload.description
      }.from(nil).to('Updated description')
    end

    context 'and the stage is Quote Provided' do
      let(:task) { create(:task, description: nil, stage: 'Quote Provided') }

      it 'sets the stage to Not Assigned' do
        expect { AdvisableSchema.execute(query, context: context) }.to change {
          task.reload.stage
        }.from('Quote Provided').to('Not Assigned')
      end
    end
  end

  context 'when updating the due_date' do
    let(:due_date) { 2.days.from_now }
    let(:input) do
      <<-GRAPHQL
      {
        id: "#{task.uid}",
        dueDate: "#{due_date.strftime('%Y-%m-%d')}",
      }
      GRAPHQL
    end

    it 'Updates the task due_date' do
      expect { AdvisableSchema.execute(query, context: context) }.to change {
        task.reload.due_date.try(:to_date)
      }.from(nil).to(due_date.to_date)
    end

    context 'and the stage is Quote Provided' do
      let(:task) do
        create(:task, due_date: nil, estimate: 4, stage: 'Quote Provided')
      end

      it 'sets the stage to Not Assigned' do
        expect { AdvisableSchema.execute(query, context: context) }.to change {
          task.reload.stage
        }.from('Quote Provided').to('Not Assigned')
      end

      it 'removes the estimate' do
        expect { AdvisableSchema.execute(query, context: context) }.to change {
          task.reload.estimate
        }.from(4).to(nil)
      end
    end
  end

  context 'when updating the estimate' do
    let(:input) do
      <<-GRAPHQL
      {
        id: "#{task.uid}",
        estimate: 8,
      }
      GRAPHQL
    end

    it 'Updates the task estimate' do
      expect { AdvisableSchema.execute(query, context: context) }.to change {
        task.reload.estimate
      }.from(nil).to(8)
    end

    context 'and the stage is Quote Requested' do
      let(:task) { create(:task, estimate: nil, stage: 'Quote Requested') }

      it "sets the stage to 'Quote Provided'" do
        expect { AdvisableSchema.execute(query, context: context) }.to change {
          task.reload.stage
        }.from('Quote Requested').to('Quote Provided')
      end

      it 'triggers a webhook' do
        expect(WebhookEvent).to receive(:trigger).with(
          'tasks.quote_provided',
          any_args
        )
        AdvisableSchema.execute(query, context: context)
      end
    end
  end

  context "when the application status is 'Stopped Working'" do
    let(:application) { create(:application, status: 'Stopped Working') }
    let(:task) { create(:task, application: application) }

    it 'returns an error' do
      response = AdvisableSchema.execute(query, context: context)
      error = response['errors'][0]['extensions']['code']
      expect(error).to eq('applicationStatusNotWorking')
    end
  end

  context 'when the trial argument is passed' do
    let(:task) { create(:task, trial: false) }
    let(:input) do
      <<-GRAPHQL
      {
        id: "#{task.uid}",
        trial: true
      }
      GRAPHQL
    end

    context 'and the specialist is logged in' do
      let(:context) { { current_user: task.application.specialist } }

      it 'sets the trial' do
        expect {
          response = AdvisableSchema.execute(query, context: context)
        }.to change { task.reload.trial }.from(false).to(true)
      end

      context 'and the application has an existing trial task' do
        let!(:trial) do
          create(:task, application: task.application, trial: true)
        end

        it 'toggles the other trial task to false' do
          expect {
            response = AdvisableSchema.execute(query, context: context)
          }.to change { trial.reload.trial }.from(true).to(false)
        end
      end

      context 'and the application has an existing trial task that is in progress' do
        let!(:trial) do
          create(
            :task,
            application: task.application, trial: true, stage: 'Working'
          )
        end

        it 'Returns an error' do
          response = AdvisableSchema.execute(query, context: context)
          error = response['data']['updateTask']['errors'][0]['code']
          expect(error).to eq('tasks.applicationHasActiveTrialTask')
        end
      end
    end

    context 'and the user is logged in' do
      let(:context) { { current_user: task.application.project.user } }

      it 'does not set the trial' do
        expect {
          response = AdvisableSchema.execute(query, context: context)
        }.to_not change { task.reload.trial }
      end
    end
  end
end
