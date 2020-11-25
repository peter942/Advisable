# All Administrate controllers inherit from this `Admin::ApplicationController`,
# making it the ideal place to put authentication logic or other
# before_actions.
#
# If you want to add pagination or other controller-level concerns,
# you're free to overwrite the RESTful controller actions.
module Admin
  class ApplicationController < Administrate::ApplicationController
    include CurrentUser
    before_action :authenticate_admin

    # Override this value to specify the number of elements to display at a time
    # on index pages. Defaults to 20.
    # def records_per_page
    #   params[:per_page] || 20
    # end
    # before_action :default_params

    # def default_params
    #   params[:order] ||= "created_at"
    #   params[:direction] ||= "desc"
    # end

    def authenticate_admin
      return if current_account&.admin?

      redirect_to '/'
    end

    def resync
      return unless ENV['STAGING']

      Airtable.sync
      redirect_to '/admin', notice: 'Airtable has been synced'
    end

    def login_as
      session[:admin_override] = params[:gid]
      redirect_to '/'
    end

    def reset_test
      return unless ENV['STAGING'] || Rails.env.development?

      TestData.reset

      redirect_to '/admin', notice: 'Test data has been reset'
    end
  end
end
